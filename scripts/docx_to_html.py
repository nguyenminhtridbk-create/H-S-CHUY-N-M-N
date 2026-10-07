"""Chuyển DOCX sang HTML tĩnh giữ thể thức văn bản hành chính (căn lề, thụt dòng, bảng, chú thích)."""
import re
import zipfile
from html import escape
from lxml import etree

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
WP = 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing'
NS = {'w': W, 'wp': WP}


def q(tag):
    return '{%s}%s' % (W, tag)


def attr(el, name):
    return el.get(q(name)) if el is not None else None


def on(el):
    """Thuộc tính bật/tắt (w:b, w:i...) """
    if el is None:
        return None
    v = el.get(q('val'))
    return not (v in ('0', 'false', 'off', 'none'))


class Docx:
    def __init__(self, path):
        z = zipfile.ZipFile(path)
        self.doc = etree.fromstring(z.read('word/document.xml'))
        self.styles = {}
        self.default_rpr = None
        self.default_ppr = None
        if 'word/styles.xml' in z.namelist():
            st = etree.fromstring(z.read('word/styles.xml'))
            dd = st.find('w:docDefaults', NS)
            if dd is not None:
                self.default_rpr = dd.find('w:rPrDefault/w:rPr', NS)
                self.default_ppr = dd.find('w:pPrDefault/w:pPr', NS)
            for s in st.findall('w:style', NS):
                self.styles[attr(s, 'styleId')] = s
        self.footnotes = {}
        if 'word/footnotes.xml' in z.namelist():
            fx = etree.fromstring(z.read('word/footnotes.xml'))
            for fn in fx.findall('w:footnote', NS):
                self.footnotes[attr(fn, 'id')] = fn
        self.used_footnotes = []
        self.base_sz = self._base_size()

    # ---- style helpers
    def _style_chain(self, sid):
        chain = []
        seen = set()
        while sid and sid in self.styles and sid not in seen:
            seen.add(sid)
            chain.append(self.styles[sid])
            b = self.styles[sid].find('w:basedOn', NS)
            sid = attr(b, 'val') if b is not None else None
        return list(reversed(chain))

    def _default_para_style(self):
        for sid, s in self.styles.items():
            if attr(s, 'type') == 'paragraph' and s.get(q('default')) in ('1', 'true'):
                return sid
        return None

    def _base_size(self):
        sizes = {}
        for p in self.doc.iter(q('p')):
            for r in p.findall('w:r', NS):
                t = ''.join(x.text or '' for x in r.findall('w:t', NS))
                if not t.strip():
                    continue
                sz = self._run_prop(r, p, 'sz')
                if sz:
                    sizes[sz] = sizes.get(sz, 0) + len(t)
        return max(sizes, key=sizes.get) if sizes else 26

    def _para_style_ids(self, p):
        ps = p.find('w:pPr/w:pStyle', NS)
        return attr(ps, 'val') if ps is not None else self._default_para_style()

    def _run_prop(self, r, p, name):
        """Giá trị w:sz/w:b... theo thứ tự: run > style ký tự > style đoạn > mặc định"""
        rpr = r.find('w:rPr', NS)
        cands = []
        if rpr is not None:
            el = rpr.find('w:' + name, NS)
            if el is not None:
                cands.append(el)
            rs = rpr.find('w:rStyle', NS)
            if rs is not None:
                for s in reversed(self._style_chain(attr(rs, 'val'))):
                    e = s.find('w:rPr/w:' + name, NS)
                    if e is not None:
                        cands.append(e)
        if not cands:
            for s in reversed(self._style_chain(self._para_style_ids(p))):
                e = s.find('w:rPr/w:' + name, NS)
                if e is not None:
                    cands.append(e)
                    break
        if not cands and self.default_rpr is not None:
            e = self.default_rpr.find('w:' + name, NS)
            if e is not None:
                cands.append(e)
        if not cands:
            return None
        e = cands[0]
        if name in ('sz',):
            return int(attr(e, 'val'))
        if name in ('b', 'i', 'caps', 'smallCaps', 'strike'):
            return on(e)
        if name == 'u':
            return attr(e, 'val') not in (None, 'none')
        if name == 'vertAlign':
            return attr(e, 'val')
        return attr(e, 'val')

    def _para_prop(self, p, path, key=None):
        ppr = p.find('w:pPr', NS)
        if ppr is not None:
            e = ppr.find(path, NS)
            if e is not None:
                return e
        for s in reversed(self._style_chain(self._para_style_ids(p))):
            e = s.find('w:pPr/' + path, NS)
            if e is not None:
                return e
        if self.default_ppr is not None:
            return self.default_ppr.find(path, NS)
        return None

    # ---- rendering
    def run_html(self, r, p, in_note=False):
        out = ''
        for ch in r:
            tag = etree.QName(ch).localname
            if tag == 't':
                out += escape(ch.text or '')
            elif tag == 'tab':
                out += '&emsp;'
            elif tag in ('br', 'cr'):
                out += '<br/>' if attr(ch, 'type') != 'page' else ''
            elif tag == 'noBreakHyphen':
                out += '&#8209;'
            elif tag == 'footnoteReference' and not in_note:
                fid = attr(ch, 'id')
                if fid not in self.used_footnotes:
                    self.used_footnotes.append(fid)
                n = self.used_footnotes.index(fid) + 1
                out += '<sup class="fn-ref"><a href="#fn-%s">%d</a></sup>' % (fid, n)
            elif tag in ('drawing', 'pict'):
                out += self.drawing_html(ch)
        if not out:
            return ''
        b = self._run_prop(r, p, 'b')
        i = self._run_prop(r, p, 'i')
        u = self._run_prop(r, p, 'u')
        va = self._run_prop(r, p, 'vertAlign')
        caps = self._run_prop(r, p, 'caps')
        strike = self._run_prop(r, p, 'strike')
        sz = self._run_prop(r, p, 'sz')
        style = []
        if caps:
            style.append('text-transform:uppercase')
        if sz and abs(sz - self.base_sz) >= 1 and not va:
            style.append('font-size:%.2fem' % (sz / self.base_sz))
        if strike:
            style.append('text-decoration:line-through')
        if u:
            style.append('text-decoration:underline')
        color = self._run_prop(r, p, 'color')
        if color and color.lower() not in ('auto', '000000'):
            style.append('color:#' + color)
        if style:
            out = '<span style="%s">%s</span>' % (';'.join(style), out)
        if va == 'superscript':
            out = '<sup>%s</sup>' % out
        elif va == 'subscript':
            out = '<sub>%s</sub>' % out
        if i:
            out = '<em>%s</em>' % out
        if b:
            out = '<strong>%s</strong>' % out
        return out

    def drawing_html(self, el):
        ext = el.find('.//wp:extent', NS)
        if ext is not None and ext.get('cy') == '0':
            width = int(ext.get('cx')) / 12700.0
            return '<span class="vb-line" style="width:%.0fpt"></span>' % width
        return ''

    def para_inner(self, p, in_note=False):
        out = ''
        for ch in p:
            tag = etree.QName(ch).localname
            if tag == 'r':
                out += self.run_html(ch, p, in_note)
            elif tag in ('hyperlink', 'smartTag', 'ins', 'sdt'):
                for r in ch.iter(q('r')):
                    out += self.run_html(r, p, in_note)
        return out

    def para_html(self, p, cell=False):
        inner = self.para_inner(p)
        jc = attr(self._para_prop(p, 'w:jc'), 'val')
        ind = self._para_prop(p, 'w:ind')
        sp = self._para_prop(p, 'w:spacing')
        style = []
        align = {'center': 'center', 'right': 'right', 'both': 'justify', 'left': 'left', 'start': 'left', 'end': 'right', 'distribute': 'justify'}.get(jc)
        if align:
            style.append('text-align:' + align)
        if ind is not None:
            left = ind.get(q('left')) or ind.get(q('start'))
            first = ind.get(q('firstLine'))
            hang = ind.get(q('hanging'))
            right = ind.get(q('right')) or ind.get(q('end'))
            if left and int(left):
                style.append('margin-left:%.1fpt' % (int(left) / 20))
            if right and int(right):
                style.append('margin-right:%.1fpt' % (int(right) / 20))
            if first and int(first):
                style.append('text-indent:%.1fpt' % (int(first) / 20))
            elif hang and int(hang):
                style.append('text-indent:-%.1fpt' % (int(hang) / 20))
        if sp is not None:
            before = sp.get(q('before'))
            after = sp.get(q('after'))
            if before is not None:
                style.append('margin-top:%.1fpt' % (int(before) / 20))
            if after is not None:
                style.append('margin-bottom:%.1fpt' % (int(after) / 20))
            line = sp.get(q('line'))
            if line and sp.get(q('lineRule')) in (None, 'auto') and int(line) != 240:
                style.append('line-height:%.2f' % (int(line) / 240))
        if not inner.strip():
            style.append('min-height:1em')
            inner = inner or '&nbsp;'
        return '<p style="%s">%s</p>' % (';'.join(style), inner)

    def table_html(self, tbl):
        grid = [int(attr(g, 'w') or 0) for g in tbl.findall('w:tblGrid/w:gridCol', NS)]
        total = sum(grid) or 1
        tblpr = tbl.find('w:tblPr', NS)
        borders = tblpr.find('w:tblBorders', NS) if tblpr is not None else None
        tstyle_borders = None
        if tblpr is not None:
            ts = tblpr.find('w:tblStyle', NS)
            if ts is not None:
                for s in self._style_chain(attr(ts, 'val')):
                    b = s.find('w:tblPr/w:tblBorders', NS)
                    if b is not None:
                        tstyle_borders = b
        eff = borders if borders is not None else tstyle_borders

        def border_on(side, el):
            if el is None:
                return False
            e = el.find('w:' + side, NS)
            return e is not None and attr(e, 'val') not in (None, 'nil', 'none')

        tbl_has_borders = eff is not None and any(border_on(s, eff) for s in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'))
        jc = attr(tblpr.find('w:jc', NS), 'val') if tblpr is not None and tblpr.find('w:jc', NS) is not None else None

        rows = tbl.findall('w:tr', NS)
        # xác định rowspan cho vMerge
        matrix = []
        for r in rows:
            cells = []
            col = 0
            for tc in r.findall('w:tc', NS):
                pr = tc.find('w:tcPr', NS)
                span = 1
                vm = None
                if pr is not None:
                    gs = pr.find('w:gridSpan', NS)
                    if gs is not None:
                        span = int(attr(gs, 'val'))
                    v = pr.find('w:vMerge', NS)
                    if v is not None:
                        vm = attr(v, 'val') or 'continue'
                cells.append({'tc': tc, 'col': col, 'span': span, 'vm': vm, 'rowspan': 1})
                col += span
            matrix.append(cells)
        for ri, cells in enumerate(matrix):
            for c in cells:
                if c['vm'] == 'restart':
                    n = 1
                    for rj in range(ri + 1, len(matrix)):
                        nxt = [x for x in matrix[rj] if x['col'] == c['col'] and x['vm'] == 'continue']
                        if nxt:
                            nxt[0]['skip'] = True
                            n += 1
                        else:
                            break
                    c['rowspan'] = n
        cls = 'doc-table' if tbl_has_borders else 'vb-plain'
        pct = 'width:100%'
        if grid and not tbl_has_borders:
            pct = 'width:100%'
        out = '<table class="%s"%s><colgroup>' % (cls, ' style="margin-left:auto;margin-right:auto;width:auto"' if jc == 'center' and False else '')
        for g in grid:
            out += '<col style="width:%.2f%%"/>' % (g * 100.0 / total)
        out += '</colgroup><tbody>'
        for cells in matrix:
            out += '<tr>'
            for c in cells:
                if c.get('skip'):
                    continue
                tc = c['tc']
                pr = tc.find('w:tcPr', NS)
                attrs = ''
                if c['span'] > 1:
                    attrs += ' colspan="%d"' % c['span']
                if c['rowspan'] > 1:
                    attrs += ' rowspan="%d"' % c['rowspan']
                st = []
                if pr is not None:
                    va = pr.find('w:vAlign', NS)
                    if va is not None:
                        st.append('vertical-align:' + {'center': 'middle', 'bottom': 'bottom'}.get(attr(va, 'val'), 'top'))
                    sh = pr.find('w:shd', NS)
                    if sh is not None and attr(sh, 'fill') not in (None, 'auto', 'FFFFFF'):
                        st.append('background:#' + attr(sh, 'fill'))
                    cb = pr.find('w:tcBorders', NS)
                    if cb is not None:
                        for side in ('top', 'left', 'bottom', 'right'):
                            e = cb.find('w:' + side, NS)
                            if e is not None and attr(e, 'val') in ('nil', 'none'):
                                st.append('border-%s:none' % side)
                            elif e is not None and not tbl_has_borders:
                                st.append('border-%s:1px solid #000' % side)
                    elif tbl_has_borders is False:
                        pass
                if attrs or st or True:
                    inner = self.block_html(tc)
                    out += '<td%s%s>%s</td>' % (attrs, (' style="%s"' % ';'.join(st)) if st else '', inner)
            out += '</tr>'
        out += '</tbody></table>'
        return out

    def block_html(self, parent):
        out = ''
        for ch in parent:
            tag = etree.QName(ch).localname
            if tag == 'p':
                out += self.para_html(ch)
            elif tag == 'tbl':
                out += self.table_html(ch)
            elif tag == 'sdt':
                c = ch.find('w:sdtContent', NS)
                if c is not None:
                    out += self.block_html(c)
        return out

    def footnotes_html(self):
        if not self.used_footnotes:
            return ''
        out = '<div class="vb-footnotes">'
        for n, fid in enumerate(self.used_footnotes, 1):
            fn = self.footnotes.get(fid)
            if fn is None:
                continue
            ps = fn.findall('w:p', NS)
            body = ' '.join(self.para_inner(p, in_note=True) for p in ps)
            out += '<p id="fn-%s"><sup>%d</sup> %s</p>' % (fid, n, body)
        return out + '</div>'

    def to_html(self):
        body = self.doc.find('w:body', NS)
        html = self.block_html(body)
        return html + self.footnotes_html()

    def to_text(self):
        """Toàn văn: mỗi đoạn một dòng, ô bảng cách nhau bằng tab, ghi chú ở cuối."""
        body = self.doc.find('w:body', NS)
        lines = []

        def ptext(p):
            s = ''
            for t in p.iter():
                tag = etree.QName(t).localname
                if tag == 't':
                    s += t.text or ''
                elif tag == 'tab':
                    s += '\t'
                elif tag in ('br', 'cr') and attr(t, 'type') != 'page':
                    s += '\n'
                elif tag == 'noBreakHyphen':
                    s += '-'
            return s

        def walk(parent):
            for ch in parent:
                tag = etree.QName(ch).localname
                if tag == 'p':
                    lines.append(ptext(ch))
                elif tag == 'tbl':
                    for tr in ch.findall('w:tr', NS):
                        cells = []
                        for tc in tr.findall('w:tc', NS):
                            cells.append(' '.join(ptext(p).strip() for p in tc.iter(q('p')) if ptext(p).strip()))
                        lines.append(' | '.join(cells))
                elif tag == 'sdt':
                    c = ch.find('w:sdtContent', NS)
                    if c is not None:
                        walk(c)

        walk(body)
        for n, fid in enumerate(self.used_footnotes, 1):
            fn = self.footnotes.get(fid)
            if fn is not None:
                lines.append('(%d) %s' % (n, ' '.join(ptext(p).strip() for p in fn.findall('w:p', NS))))
        return '\n'.join(lines)


def convert(path):
    d = Docx(path)
    html = d.to_html()
    text = d.to_text()
    return html, text
