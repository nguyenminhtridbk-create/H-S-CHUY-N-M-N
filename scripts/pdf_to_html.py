"""Chuyển PDF có lớp chữ sang HTML tĩnh giữ bố cục văn bản hành chính (căn lề, thụt dòng, bảng)."""
import re
from html import escape
import pymupdf

LINE_TOL = 2.0


def span_html(sp, base):
    t = sp['text']
    if not t:
        return ''
    t = escape(t)
    fl = sp['flags']
    font = sp.get('font', '').lower()
    bold = bool(fl & 16) or 'bold' in font
    ital = bool(fl & 2) or 'italic' in font or 'oblique' in font
    sup = bool(fl & 1) and sp['size'] < base * 0.8
    if sup:
        t = '<sup>%s</sup>' % t
    if ital:
        t = '<em>%s</em>' % t
    if bold:
        t = '<strong>%s</strong>' % t
    if abs(sp['size'] - base) > 0.9 and not sup:
        t = '<span style="font-size:%.2fem">%s</span>' % (sp['size'] / base, t)
    return t


def line_html(line, base):
    out = ''
    for sp in line['spans']:
        out += span_html(sp, base)
    return out


def line_text(line):
    return ''.join(sp['text'] for sp in line['spans'])


def merge_inline(html):
    html = re.sub(r'</strong><strong>', '', html)
    html = re.sub(r'</em><em>', '', html)
    return html


class Pdf:
    def __init__(self, path):
        self.doc = pymupdf.open(path)
        self.base = self._base_size()
        self.page_notes = {i: [] for i in range(len(self.doc))}

    def _base_size(self):
        sizes = {}
        for pg in self.doc:
            for b in pg.get_text('dict')['blocks']:
                for l in b.get('lines', []):
                    for s in l['spans']:
                        if s['text'].strip():
                            k = round(s['size'] * 2) / 2
                            sizes[k] = sizes.get(k, 0) + len(s['text'])
        return max(sizes, key=sizes.get) if sizes else 13

    # ---- bảng
    def table_html(self, page, tb):
        rows = tb.rows
        cells = []
        for ri, row in enumerate(rows):
            for ci, bb in enumerate(row.cells):
                if bb is not None:
                    cells.append((ri, ci, bb))
        xs = sorted({round(c[2][0], 0) for c in cells} | {round(c[2][2], 0) for c in cells})
        ys = sorted({round(c[2][1], 0) for c in cells} | {round(c[2][3], 0) for c in cells})

        def merge(vals, tol=3):
            out = []
            for v in vals:
                if out and v - out[-1] <= tol:
                    continue
                out.append(v)
            return out

        xs = merge(xs)
        ys = merge(ys)

        def idx(vals, v):
            return min(range(len(vals)), key=lambda i: abs(vals[i] - v))

        grid = []
        for ri, ci, bb in cells:
            c0, c1 = idx(xs, bb[0]), idx(xs, bb[2])
            r0, r1 = idx(ys, bb[1]), idx(ys, bb[3])
            grid.append((r0, c0, max(1, r1 - r0), max(1, c1 - c0), bb))
        nrows, ncols = len(ys) - 1, len(xs) - 1
        occupied = [[False] * ncols for _ in range(nrows)]
        by_pos = {}
        for r0, c0, rs, cs, bb in grid:
            by_pos[(r0, c0)] = (rs, cs, bb)
            for r in range(r0, min(nrows, r0 + rs)):
                for c in range(c0, min(ncols, c0 + cs)):
                    occupied[r][c] = True
        width = xs[-1] - xs[0]
        out = '<table class="doc-table"><colgroup>'
        for i in range(ncols):
            out += '<col style="width:%.2f%%"/>' % ((xs[i + 1] - xs[i]) * 100.0 / width)
        out += '</colgroup><tbody>'
        for r in range(nrows):
            out += '<tr>'
            for c in range(ncols):
                if (r, c) in by_pos:
                    rs, cs, bb = by_pos[(r, c)]
                    a = ''
                    if cs > 1:
                        a += ' colspan="%d"' % cs
                    if rs > 1:
                        a += ' rowspan="%d"' % rs
                    out += '<td%s>%s</td>' % (a, self.cell_html(page, bb))
                elif not occupied[r][c]:
                    out += '<td></td>'
            out += '</tr>'
        out += '</tbody></table>'
        return {'kind': 'table', 'html': out, 'ncols': ncols, 'xs': xs, 'bbox': tuple(tb.bbox)}

    def cell_html(self, page, bb):
        clip = pymupdf.Rect(bb[0] + 1, bb[1] + 1, bb[2] - 1, bb[3] - 1)
        d = page.get_text('dict', clip=clip)
        paras = []
        for b in d['blocks']:
            lines = b.get('lines', [])
            cur = None
            prev_line = None
            for l in lines:
                txt = line_text(l)
                if not txt.strip():
                    continue
                starts_new = cur is None
                if prev_line is not None:
                    gap = l['bbox'][1] - prev_line['bbox'][3]
                    lh = l['bbox'][3] - l['bbox'][1]
                    short = prev_line['bbox'][2] < clip.x1 - 14 - (clip.x1 - clip.x0) * 0.02
                    if gap > lh * 0.55 or short or re.match(r'^\s*([-–•+]|\d+[.)]|[a-zđ][.)])\s', txt):
                        starts_new = True
                if starts_new:
                    cur = {'lines': [], 'bbox': list(l['bbox'])}
                    paras.append(cur)
                cur['lines'].append(l)
                cur['bbox'][2] = max(cur['bbox'][2], l['bbox'][2])
                prev_line = l
        out = ''
        for p in paras:
            h = self.join_lines(p['lines'])
            xs0 = min(l['bbox'][0] for l in p['lines'])
            xs1 = max(l['bbox'][2] for l in p['lines'])
            centre = abs(((xs0 + xs1) / 2) - (clip.x0 + clip.x1) / 2) < 3 and (xs0 - clip.x0) > 4
            style = 'text-align:center' if centre else 'text-align:left'
            out += '<p style="%s">%s</p>' % (style, h)
        return out

    def join_lines(self, lines):
        h = ''
        for i, l in enumerate(lines):
            lh = line_html(l, self.base)
            txt = line_text(l)
            if i > 0:
                prev = line_text(lines[i - 1])
                if prev.rstrip().endswith('-') and not prev.rstrip().endswith(' -') and len(prev.rstrip()) > 1 and prev.rstrip()[-2].isalnum():
                    pass
                else:
                    h += ' '
            h += lh
        return merge_inline(h)

    # ---- trang
    def page_items(self, pi):
        page = self.doc[pi]
        H = page.rect.height
        tables = []
        try:
            for tb in page.find_tables(strategy='lines_strict').tables:
                if tb.row_count >= 1 and tb.col_count >= 2:
                    tables.append(tb)
        except Exception:
            pass
        tb_rects = [pymupdf.Rect(t.bbox) for t in tables]
        lines = []
        for b in page.get_text('dict')['blocks']:
            if b['type'] != 0:
                continue
            for l in b['lines']:
                if not line_text(l).strip():
                    continue
                rect = pymupdf.Rect(l['bbox'])
                if any((rect & tr).get_area() > 0.5 * rect.get_area() for tr in tb_rects if rect.intersects(tr)):
                    continue
                txt = line_text(l).strip()
                if l['spans'][0]['size'] < self.base * 0.88 and l['bbox'][1] > H * 0.7 and (self.page_notes[pi] or re.match(r'^\d{1,2}\s*\S', txt)):
                    self.page_notes[pi].append(txt)  # ch? th?ch cu?i trang
                    continue
                if re.fullmatch(r'[-?\s]*\d{1,3}[-?\s]*', txt) and (l['bbox'][1] < 60 or l['bbox'][3] > H - 60):
                    continue  # s? trang
                lines.append(l)
        lines = self.fill_blanks(lines)
        lines = self.merge_rows(lines)
        lines.sort(key=lambda l: (l['bbox'][1], l['bbox'][0]))
        # d?i: c?c d?ng ch?ng l?n theo chi?u d?c
        bands = []
        for l in lines:
            y0, y1 = l['bbox'][1], l['bbox'][3]
            mid = (y0 + y1) / 2
            if bands and (y0 < bands[-1]['y1'] - 0.35 * (y1 - y0)):
                bands[-1]['lines'].append(l)
                bands[-1]['y1'] = max(bands[-1]['y1'], y1)
            else:
                bands.append({'lines': [l], 'y0': y0, 'y1': y1})
        items = []
        for bd in bands:
            items.append(('band', self.split_columns(bd['lines']), bd['y0']))
        for t in tables:
            items.append(('table', t, t.bbox[1]))
        items.sort(key=lambda x: x[2])
        return page, items

    def fill_blanks(self, lines):
        """Ch? ?i?n v?o ch? tr?ng c?a m?u (s? v?n b?n, ng?y) ???c ch?n v?o ??ng kho?ng tr?ng c?a d?ng ch?a n?."""
        consumed = set()
        for mi, m in enumerate(lines):
            mt = line_text(m).strip()
            if not mt or len(mt) > 12:
                continue
            mcx = (m['bbox'][0] + m['bbox'][2]) / 2
            mcy = (m['bbox'][1] + m['bbox'][3]) / 2
            best = None
            for hi, h in enumerate(lines):
                if hi == mi or hi in consumed:
                    continue
                hh = h['bbox'][3] - h['bbox'][1]
                if not (h['bbox'][0] - 1 <= mcx <= h['bbox'][2] + 1) or abs((h['bbox'][1] + h['bbox'][3]) / 2 - mcy) > 0.9 * hh:
                    continue
                for si, sp in enumerate(h['spans']):
                    sb = sp['bbox']
                    n = max(1, len(sp['text']))
                    for mm in re.finditer(r' {3,}', sp['text']):
                        x = sb[0] + (mm.start() + mm.end()) / 2 / n * (sb[2] - sb[0])
                        d = abs(x - mcx)
                        if d < 30 and (best is None or d < best[0]):
                            best = (d, hi, si, mm.start(), mm.end())
            if best:
                _, hi, si, a, b = best
                sp = lines[hi]['spans'][si]
                t = sp['text']
                tail = '' if t[b:b + 1] in ('/', ',', '.') else ' '
                lead = '' if a == 0 else ' '
                sp['text'] = t[:a] + lead + mt + tail + t[b:]
                consumed.add(mi)
        return [l for i, l in enumerate(lines) if i not in consumed]

    def merge_rows(self, lines):
        """G?p c?c ?o?n ch? n?m c?ng m?t h?ng v? s?t nhau (v? d? s?/ng?y ?i?n v?o ch? tr?ng) th?nh m?t d?ng."""
        lines = sorted(lines, key=lambda l: l['bbox'][0])
        used = [False] * len(lines)
        out = []
        for i, l in enumerate(lines):
            if used[i]:
                continue
            cur = {'bbox': list(l['bbox']), 'spans': list(l['spans'])}
            used[i] = True
            changed = True
            while changed:
                changed = False
                for j, m in enumerate(lines):
                    if used[j]:
                        continue
                    hc = max(cur['bbox'][3] - cur['bbox'][1], m['bbox'][3] - m['bbox'][1])
                    cc = (cur['bbox'][1] + cur['bbox'][3]) / 2
                    mc = (m['bbox'][1] + m['bbox'][3]) / 2
                    gap = m['bbox'][0] - cur['bbox'][2]
                    if abs(cc - mc) < 0.45 * hc and -2 <= gap < 12:
                        cur['spans'] += m['spans']
                        cur['bbox'] = [min(cur['bbox'][0], m['bbox'][0]), min(cur['bbox'][1], m['bbox'][1]), max(cur['bbox'][2], m['bbox'][2]), max(cur['bbox'][3], m['bbox'][3])]
                        used[j] = True
                        changed = True
            out.append(cur)
        return out

    def split_columns(self, lines):
        """Tr? v? danh s?ch c?t (m?i c?t l? danh s?ch d?ng theo th? t? d?c)."""
        if len(lines) == 1:
            return [lines]
        iv = sorted((l['bbox'][0], l['bbox'][2]) for l in lines)
        groups = [[iv[0][0], iv[0][1]]]
        for a, b in iv[1:]:
            if a > groups[-1][1] + 12:
                groups.append([a, b])
            else:
                groups[-1][1] = max(groups[-1][1], b)
        if len(groups) == 1:
            return [sorted(lines, key=lambda l: l['bbox'][1])]
        cols = [[] for _ in groups]
        for l in lines:
            for i, g in enumerate(groups):
                if l['bbox'][0] >= g[0] - 1 and l['bbox'][2] <= g[1] + 1:
                    cols[i].append(l)
                    break
        return [sorted(c, key=lambda l: l['bbox'][1]) for c in cols if c]

    def convert(self):
        seq = []
        for pi in range(len(self.doc)):
            page, items = self.page_items(pi)
            W = page.rect.width
            single = [l for k, o, _ in items if k == 'band' and len(o) == 1 for l in o[0]]
            all_x0 = [l['bbox'][0] for l in single]
            all_x1 = [l['bbox'][2] for l in single]
            lm = sorted(all_x0)[len(all_x0) // 8] if all_x0 else 40
            rm = sorted(all_x1)[-max(1, len(all_x1) // 8)] if all_x1 else W - 40
            for kind, obj, _ in items:
                if kind == 'table':
                    obj = self.table_html(page, obj)
                seq.append((pi, kind, obj, lm, rm, page))
        return self.render(seq)

    def classify_para(self, lines, lm, rm, W):
        x0 = min(l['bbox'][0] for l in lines)
        x1 = max(l['bbox'][2] for l in lines)
        first = lines[0]['bbox'][0]
        centre_ok = all(abs((l['bbox'][0] + l['bbox'][2]) / 2 - W / 2) < 6 for l in lines) and x0 - lm > 6
        if centre_ok:
            return 'center', 0, 0
        if len(lines) == 1 and x1 > rm - 3 and (x1 - x0) < (rm - lm) * 0.45 and x0 - lm > (rm - lm) * 0.3:
            return 'right', 0, 0
        indent = first - lm
        multi = len(lines) > 1
        if multi and indent > 8 and all(abs(l['bbox'][0] - first) < 4 for l in lines[1:]):
            return ('justify', 0, indent)
        if not multi and indent > 60:
            return ('left', 0, indent)
        rest = [l['bbox'][0] for l in lines[1:]]
        if multi and rest and min(rest) - lm > 8 and abs(min(rest) - max(rest)) < 4:
            return ('justify', first - min(rest), min(rest) - lm)
        return ('justify' if multi else 'left'), (indent if indent > 8 else 0), 0

    def split_paras(self, blk, lm, rm):
        lines = blk['lines']
        paras = []
        cur = None
        prev = None
        for l in lines:
            new = cur is None
            if prev is not None:
                gap = l['bbox'][1] - prev['bbox'][3]
                lh = max(1, l['bbox'][3] - l['bbox'][1])
                prev_short = prev['bbox'][2] < rm - 22
                indented = l['bbox'][0] - prev['bbox'][0] > 8 or (prev['bbox'][0] - l['bbox'][0] > 8 and prev['bbox'][0] - lm > 8 and False)
                centred_change = (abs((l['bbox'][0] + l['bbox'][2]) / 2 - (prev['bbox'][0] + prev['bbox'][2]) / 2) > 15) and (prev['bbox'][2] < rm - 22)
                if gap > lh * 0.6 or prev_short or indented or centred_change:
                    new = True
                if not new and abs(l['spans'][0]['size'] - prev['spans'][0]['size']) > 1.2:
                    new = True
            if new:
                cur = []
                paras.append(cur)
            cur.append(l)
            prev = l
        return paras

    def render(self, seq):
        blocks = []
        pending = []  # c?c d?i m?t c?t li?n ti?p -> g?p ?? t?ch ?o?n
        pending_ctx = None

        def flush():
            nonlocal pending, pending_ctx
            if pending:
                pi, lm, rm, W = pending_ctx
                for p in self.split_paras({'lines': pending}, lm, rm):
                    blocks.append(self.para_block(p, lm, rm, W, pi))
                pending = []

        for pi, kind, obj, lm, rm, page in seq:
            W = page.rect.width
            if kind == 'table':
                flush()
                blocks.append(obj | {'page': pi})
                continue
            if len(obj) == 1:
                if pending and pending_ctx[0] != pi:
                    flush()
                pending_ctx = (pi, lm, rm, W)
                pending.extend(obj[0])
                continue
            flush()
            x0 = min(l['bbox'][0] for c in obj for l in c)
            x1 = max(l['bbox'][2] for c in obj for l in c)
            w = x1 - x0 or 1
            cells = []
            for c in obj:
                cx0 = min(l['bbox'][0] for l in c)
                cx1 = max(l['bbox'][2] for l in c)
                inner = ''
                for p in self.split_paras({'lines': c}, cx0, cx1):
                    inner += self.para_block(p, cx0, cx1, W, pi, in_col=True)['html']
                cells.append((cx0, cx1, inner))
            t = '<table class="vb-plain"><colgroup>' + ''.join('<col style="width:%.1f%%"/>' % ((c[1] - c[0]) * 100.0 / w) for c in cells) + '</colgroup><tbody><tr>'
            t += ''.join('<td>%s</td>' % c[2] for c in cells) + '</tr></tbody></table>'
            blocks.append({'kind': 'band', 'html': t, 'page': pi})
        flush()
        return self.finalize(blocks)

    def para_block(self, lines, lm, rm, W, pi, in_col=False):
        if in_col:
            c0 = (lines[0]['bbox'][0] + lines[0]['bbox'][2]) / 2
            centred = all(abs((l['bbox'][0] + l['bbox'][2]) / 2 - c0) < 4 for l in lines) and (len(lines) > 1 or abs(c0 - (lm + rm) / 2) < 4)
            if line_text(lines[0]).lstrip().startswith(('-', '?')):
                centred = False
            align, indent, margin = ('center' if centred else 'left'), 0, 0
        else:
            align, indent, margin = self.classify_para(lines, lm, rm, W)
        h = self.join_lines(lines)
        style = 'text-align:%s' % align
        if indent:
            style += ';text-indent:%.0fpt' % indent
        if margin:
            style += ';margin-left:%.0fpt' % margin
        last_full = lines[-1]['bbox'][2] > rm - 22
        return {
            'kind': 'p', 'html': '<p style="%s">%s</p>' % (style, h), 'inner': h, 'style': style,
            'page': pi, 'indent': indent, 'last_full': last_full, 'first_text': line_text(lines[0]).lstrip(),
            'last_text': line_text(lines[-1]).rstrip(), 'align': align,
        }

    def finalize(self, blocks):
        out = []
        for b in blocks:
            if out:
                prev = out[-1]
                # đoạn văn bị ngắt qua trang
                if (b['kind'] == 'p' and prev['kind'] == 'p' and b['page'] != prev['page'] and prev['last_full']
                        and not b['indent'] and b['align'] == prev['align'] == 'justify' and b['first_text'][:1].islower()):
                    sep = '' if prev['last_text'].endswith('-') else ' '
                    prev['inner'] += sep + b['inner']
                    prev['html'] = '<p style="%s">%s</p>' % (prev['style'], merge_inline(prev['inner']))
                    continue
                # bảng kéo dài qua trang
                if (b['kind'] == 'table' and prev['kind'] == 'table' and b['page'] != prev['page'] and b['ncols'] == prev['ncols']
                        and abs(b['xs'][0] - prev['xs'][0]) < 6 and abs(b['xs'][-1] - prev['xs'][-1]) < 6):
                    body = re.search(r'<tbody>(.*)</tbody>', b['html'], re.S).group(1)
                    prev['html'] = prev['html'].replace('</tbody></table>', body + '</tbody></table>')
                    prev['page'] = b['page']
                    continue
            out.append(b)
        html = '\n'.join(b['html'] for b in out)
        notes = [t for i in sorted(self.page_notes) for t in self.page_notes[i]]
        if notes:
            html += '<div class="vb-footnotes">' + ''.join('<p>%s</p>' % escape(t) for t in notes) + '</div>'
        return html

    def text(self):
        return '\n'.join(self.doc[i].get_text() for i in range(len(self.doc)))
