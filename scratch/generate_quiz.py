import re

def parse_quiz():
    with open('quiz_raw.txt', 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by Question N
    # Some questions have "Incorrect" before "Question N"
    # We can split by regex looking for "Question \d+"
    
    parts = re.split(r'(?:Incorrect\n)?Question (\d+)\n', content)
    # parts[0] is empty or whitespace
    # parts[1] is '1'
    # parts[2] is the rest of question 1
    
    questions = []
    for i in range(1, len(parts), 2):
        q_num = parts[i]
        q_body = parts[i+1].strip()
        
        # Extract points
        # First line is usually "x / y pts"
        lines = q_body.split('\n')
        points = lines[0].strip()
        
        # Rest is the question text and answer
        rest = '\n'.join(lines[1:]).strip()
        
        # It's hard to distinguish question text from choices perfectly,
        # but we can just present the whole text as "Answer / Content"
        # Or we can treat the first paragraph as the question text, and the rest as the answer.
        # Let's split by double newline. The first block is the question. The rest is the choices/answer.
        blocks = re.split(r'\n\s*\n', rest)
        
        q_text = blocks[0].strip()
        q_answer = '\n\n'.join(blocks[1:]).strip() if len(blocks) > 1 else ""
        
        questions.append({
            'num': q_num,
            'points': points,
            'text': q_text,
            'answer': q_answer
        })

    html = []
    html.append('          <!-- Quiz #2 -->')
    html.append('          <div class="card fade-in">')
    html.append('            <div class="card__header">')
    html.append('              <div class="card__header-text">')
    html.append('                <p class="card__label">Quiz #2</p>')
    html.append('                <h3 class="card__title">Quiz 2 Content</h3>')
    html.append('              </div>')
    html.append('              <span class="card__chevron">▼</span>')
    html.append('            </div>')
    html.append('            <div class="card__body">')
    html.append('              <div class="card__content">')

    for q in questions:
        q_text_html = q['text'].replace('\n', '<br>')
        q_answer_html = q['answer'].replace('\n', '<br>')
        
        html.append('')
        html.append(f'                <!-- Question {q["num"]} -->')
        html.append('                <div class="card fade-in" style="margin-top: var(--sp-4); box-shadow: none; border: 1px solid var(--border);">')
        html.append('                  <div class="card__header" style="padding: var(--sp-3);">')
        html.append('                    <div class="card__header-text">')
        html.append(f'                      <p class="card__label">{q["points"]}</p>')
        html.append(f'                      <h3 class="card__title" style="font-size: var(--text-base); font-weight: normal;"><strong>Question {q["num"]}:</strong> {q_text_html}</h3>')
        html.append('                    </div>')
        html.append('                    <span class="card__chevron">▼</span>')
        html.append('                  </div>')
        html.append('                  <div class="card__body">')
        html.append('                    <div class="card__content" style="padding: var(--sp-3);">')
        
        if q_answer_html:
            html.append('                      <div class="qa">')
            html.append('                        <p class="qa__answer-label">Answer / Options</p>')
            html.append(f'                        <p class="qa__answer-text" style="font-family: var(--font-mono); font-size: var(--text-sm);">{q_answer_html}</p>')
            html.append('                      </div>')
        else:
            html.append('                      <p class="qa__answer-text" style="font-style: italic; color: var(--text-muted);">No options provided</p>')
            
        html.append('                    </div>')
        html.append('                  </div>')
        html.append('                </div>')

    html.append('')
    html.append('              </div>')
    html.append('            </div>')
    html.append('          </div>')

    with open('quiz_html.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(html))

if __name__ == '__main__':
    parse_quiz()
