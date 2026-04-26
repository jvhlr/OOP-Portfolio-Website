import re
import sys

def main():
    file_path = "midterm.html"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    correct_answers = {
        1: "True",
        2: "True",
        5: "Method Body",
        6: "Second row, third column",
        7: "A block of code that performs a specific task",
        8: "True",
        9: "5",
        10: "False",
        11: "Array",
        12: "Index",
        14: "length()",
        15: "2D Array",
        16: "Exit Loop",
        17: "Even",
        18: "Infinite",
        20: "Nested if statement",
        21: "D. Both B and C",
        22: "Skips Iteration",
        24: "True",
        27: "123",
        28: "True",
        30: "True",
        31: "Command line input",
        32: "nextLine()",
        34: "False",
        37: "False",
        38: "java.io.Consolelibrary",
        39: "False",
        40: "False",
        41: "String[] args",
        42: "To avoid memory leaks",
        43: "nextFloat()",
        44: "Scanner",
        45: "To buffer and read text input",
    }

    # We need to find the entire Quiz #2 block
    quiz_start = content.find("<!-- Quiz #2 -->")
    if quiz_start == -1:
        print("Quiz #2 not found!")
        return

    # Find where Quiz #2 ends. It's inside a <div class="tab-panel active" id="p-quizzes" role="tabpanel">
    # The next section is probably <!-- ══════════ SEATWORK ══════════ -->
    quiz_end = content.find("<!-- ══════════ SEATWORK", quiz_start)
    if quiz_end == -1:
        quiz_end = len(content)

    quiz_content = content[quiz_start:quiz_end]

    # Split by questions
    question_pattern = re.compile(r'(<!-- Question (\d+) -->.*?)(?=<!-- Question \d+ -->|</div>\s*</div>\s*</div>\s*<!--)', re.DOTALL)
    
    questions = list(question_pattern.finditer(quiz_content))
    
    new_quiz_content = quiz_content
    for match in questions:
        q_block = match.group(1)
        q_num = int(match.group(2))
        
        # 1. Remove chevron
        new_q_block = re.sub(r'<span class="card__chevron">.*?</span>', '', q_block)
        
        # 2. Change the header padding/clickable nature if we want to remove the dropdown aspect
        # The user said "remove the dropdown option for each question".
        # This implies it should just be open by default.
        # We can remove class="card__body" wrapping the content so it's always visible and not managed by JS.
        # The JS toggles .expanded on .card. But if we change the inner .card__body to .question__body or something, JS won't touch it.
        # Let's just remove `class="card__body"` entirely and replace it with `<div style="display: block;">`
        new_q_block = new_q_block.replace('class="card__body"', 'style="display: block;"')
        
        # 3. Also the card should not behave like a dropdown header
        new_q_block = new_q_block.replace('class="card__header"', 'class="card__header--static"')
        
        # 4. Highlight correct answer if applicable
        if q_num in correct_answers:
            ans = correct_answers[q_num]
            # Find the answer text block
            ans_text_match = re.search(r'(<p class="qa__answer-text"[^>]*>)(.*?)(</p>)', new_q_block, re.DOTALL)
            if ans_text_match:
                options_str = ans_text_match.group(2)
                # Split options by <br> or \n
                # We need to find the specific string and wrap it
                # Using a case-insensitive replace since case might differ slightly (e.g., "Exit Loop" vs "Exit loop")
                # Need to be careful not to replace parts of other words.
                
                # Let's escape the answer for regex
                escaped_ans = re.escape(ans)
                # Allow for possible leading/trailing whitespace
                pattern = re.compile(rf'(?i)(\b{escaped_ans}\b|{escaped_ans})')
                
                # Replace with highlighted version
                highlighted = f'<span style="color: #8edba1; font-weight: 700;">{ans}</span>'
                
                # To only replace the whole option, we can split by <br> and check each
                options = re.split(r'\s*<br>\s*', options_str)
                new_options = []
                for opt in options:
                    # Normalize all whitespace (including newlines) to single spaces
                    normalized_opt = re.sub(r'\s+', ' ', opt).strip().lower()
                    normalized_ans = re.sub(r'\s+', ' ', ans).strip().lower()
                    
                    if normalized_opt == normalized_ans or normalized_opt.replace(" ", "") == normalized_ans.replace(" ", ""):
                        new_options.append(f'<span style="color: #8edba1; font-weight: 700; background: rgba(142, 219, 161, 0.1); padding: 2px 6px; border-radius: 4px;">{opt.strip()} &nbsp;✓</span>')
                    else:
                        new_options.append(opt.strip())
                
                new_options_str = ' <br> '.join(new_options)
                
                new_q_block = new_q_block[:ans_text_match.start(2)] + new_options_str + new_q_block[ans_text_match.end(2):]
                
        new_quiz_content = new_quiz_content.replace(q_block, new_q_block)
        
    final_content = content[:quiz_start] + new_quiz_content + content[quiz_end:]
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(final_content)
        
    print("Successfully updated midterm.html")

if __name__ == "__main__":
    main()
