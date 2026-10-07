"""Dựng nội dung văn bản đến từ thư mục VAN-BAN-DEN -> src/data/directiveSources.json + public/van-ban/*.jpg"""
import glob, json, os, re, subprocess, sys
import pymupdf
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))
from docx_to_html import convert as docx_convert
from pdf_to_html import Pdf

TESS = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
TESSDATA = os.path.join(ROOT, 'tmp2', 'tessdata')
OUT_IMG = os.path.join(ROOT, 'public', 'van-ban')
os.makedirs(OUT_IMG, exist_ok=True)


def find(pat):
    return glob.glob(os.path.join(ROOT, 'VAN-BAN-DEN', '**', pat), recursive=True)[0]


def clean_text(t):
    return re.sub(r'[ \t]+\n', '\n', t).strip()


def from_pdf(pat):
    p = Pdf(find(pat))
    return p.convert(), clean_text(p.text())


def from_docx(pat):
    h, t = docx_convert(find(pat))
    return h, clean_text(t)


def tess(args):
    return subprocess.run([TESS] + args, capture_output=True, text=True, encoding='utf-8', env={**os.environ, 'TESSDATA_PREFIX': TESSDATA})


def from_scan(pat, slug):
    doc = pymupdf.open(find(pat))
    imgs, texts = [], []
    for i, pg in enumerate(doc):
        png = os.path.join(ROOT, 'tmp2', f'{slug}_{i+1:02d}.png')
        pg.get_pixmap(dpi=200).save(png)
        osd = tess([png, 'stdout', '--psm', '0', '-l', 'osd']).stdout
        m = re.search(r'Rotate: (\d+)', osd)
        rot = int(m.group(1)) if m else 0
        im = Image.open(png).convert('RGB')
        if rot:
            im = im.rotate(-rot, expand=True)
        im.save(png)
        small = im.copy()
        small.thumbnail((1400, 1400))
        name = f'{slug}-{i+1:02d}.jpg'
        small.save(os.path.join(OUT_IMG, name), quality=72, optimize=True)
        txt = tess([png, 'stdout', '-l', 'vie', '--psm', '6']).stdout
        texts.append(txt.strip())
        imgs.append(f'<img src="/van-ban/{name}" alt="{slug} - trang {i+1}" loading="lazy"/>')
        print(slug, i + 1, 'rot', rot, flush=True)
    html = '<div class="vb-scan">' + ''.join(imgs) + '</div>'
    return html, '\n\n'.join(texts)


JOBS = {
    'directive-kh831-ubnd': lambda: from_pdf('KH 831-HUONG NGHIEP VA PHAN LUONG.pdf'),
    'directive-kh998-sgddt': lambda: from_pdf('998-kh-huongnghiepvaphanluong-sgd_signed.pdf'),
    'directive-cv3635-sgddt': lambda: from_pdf('CV 3635*.pdf'),
    'directive-kh195-sgddt': lambda: from_docx('KH_TRIEN_KHAI*.docx'),
    'directive-tb-nls-truong': lambda: from_docx('Th*ng b*o.docx'),
    'directive-tt16-bgddt': lambda: from_scan('TT 16-2026*BGD.pdf', 'tt16'),
    'directive-cv3456-bgddt': lambda: from_scan('3456_BGDDT*.pdf', 'cv3456'),
    'directive-khung-nls-3456': lambda: from_scan('KHUNG__NANG*.pdf', 'khung-nls'),
}

if __name__ == '__main__':
    only = set(sys.argv[1:])
    path = os.path.join(ROOT, 'src', 'data', 'directiveSources.json')
    data = json.load(open(path, encoding='utf-8')) if os.path.exists(path) else {}
    for k, fn in JOBS.items():
        if only and k not in only:
            continue
        h, t = fn()
        data[k] = {'html': h, 'text': t}
        print(k, len(h), len(t), flush=True)
        json.dump(data, open(path, 'w', encoding='utf-8'), ensure_ascii=False)
