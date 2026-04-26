import re
import os

def update_midterm():
    target_path = '../midterm.html'
    
    with open(target_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    with open('quiz_html.txt', 'r', encoding='utf-8') as f:
        quiz_html = f.read()
        
    target = """          <div class="empty-state fade-in">
            <div class="empty-state__icon">Q</div>
            <h3 class="empty-state__title">Content Incoming</h3>
            <p class="empty-state__text">
              Midterm quiz questions, answers, and explanations will be added here once available.
              Stay tuned for coverage on classes, objects, encapsulation, and more.
            </p>
          </div>"""
          
    if target in html:
        new_html = html.replace(target, quiz_html)
        with open(target_path, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print("Replaced successfully.")
    else:
        print("Target not found.")

if __name__ == '__main__':
    update_midterm()
