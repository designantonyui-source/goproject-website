"""Render the approved static FAQ and project-card templates. Run after editing src/data."""
from pathlib import Path
from string import Template
import json, html, re
ROOT = Path(__file__).resolve().parents[1]

def template(name):
    return Template((ROOT / 'src/templates' / name).read_text())

for name, data in json.loads((ROOT / 'src/data/shared-faq.json').read_text()).items():
    items = []
    for i, item in enumerate(data['items'], 1):
        prefix = data['section_id'] + '-' + str(i)
        items.append(template('faq-item.html').substitute(button_id=prefix+'-button', answer_id=prefix+'-answer', question=html.escape(item['question']), answer=item['answer']))
    rendered = template('faq-section.html').substitute(**{k:v for k,v in data.items() if k!='items'}, items='\n'.join(items))
    p = ROOT / name
    p.write_text(re.sub(r'<!-- shared-faq:start -->.*?<!-- shared-faq:end -->', lambda _: '<!-- shared-faq:start -->\n'+rendered+'<!-- shared-faq:end -->', p.read_text(), flags=re.S))

for name, cards in json.loads((ROOT / 'src/data/project-cards.json').read_text()).items():
    rendered = '\n'.join(template('project-card.html').substitute(**card) for card in cards)
    p = ROOT / name
    p.write_text(re.sub(r'<!-- project-cards:start -->.*?<!-- project-cards:end -->', lambda _: '<!-- project-cards:start -->\n<div class="project-showcase">\n'+rendered+'\n</div>\n<!-- project-cards:end -->', p.read_text(), flags=re.S))

for name, data in json.loads((ROOT / 'src/data/service-content.json').read_text()).items():
    p = ROOT / name
    source = p.read_text()
    for kind, item_template, wrapper in [('options', 'service-option.html', None), ('steps', 'service-step.html', 'service-steps mt-14')]:
        rendered = '\n'.join(template(item_template).substitute(**item) for item in data[kind])
        if wrapper:
            rendered = '<ol class="'+wrapper+'">\n'+rendered+'\n</ol>'
        marker = 'service-'+kind
        source = re.sub(r'<!-- '+marker+r':start -->.*?<!-- '+marker+r':end -->', lambda _: '<!-- '+marker+':start -->\n'+rendered+'\n<!-- '+marker+':end -->', source, flags=re.S)
    p.write_text(source)
