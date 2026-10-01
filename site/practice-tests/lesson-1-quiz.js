(() => {
  const page = document.querySelector('[data-quiz-set]');
  const setNumber = Number(page.dataset.quizSet);
  const set = lesson1Sets[setNumber - 1];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const form = document.getElementById('quiz-form');
  const questions = document.getElementById('questions');
  const result = document.getElementById('result');

  set.mc.forEach((item, index) => {
    const [prompt, options, answer, explanation, , multi] = item;
    const name = `q${index + 1}`;
    const card = document.createElement('fieldset');
    card.className = 'quiz-item';
    const legend = document.createElement('legend');
    legend.innerHTML = `<strong>${index + 1}.</strong> ${prompt}${multi ? ' <span class="question-type">Select all that apply</span>' : ''}`;
    card.append(legend);
    options.forEach((option, optionIndex) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = multi ? 'checkbox' : 'radio';
      input.name = name;
      input.value = letters[optionIndex];
      if (optionIndex === 0) input.required = true;
      label.append(input, document.createTextNode(` ${letters[optionIndex]}. ${option}`));
      card.append(label);
    });
    const feedback = document.createElement('div');
    feedback.className = 'feedback';
    feedback.hidden = true;
    card.append(feedback);
    questions.append(card);
  });

  const writtenHeading = document.createElement('h2');
  writtenHeading.textContent = 'Part B · Written response';
  questions.append(writtenHeading);
  set.written.forEach(([prompt, key], index) => {
    const card = document.createElement('fieldset');
    card.className = 'quiz-item written';
    const legend = document.createElement('legend');
    legend.innerHTML = `<strong>${index + 1}.</strong> ${prompt}`;
    const area = document.createElement('textarea');
    area.name = `written${index + 1}`;
    area.required = true;
    area.rows = 4;
    area.placeholder = 'Write your response in complete sentences…';
    const feedback = document.createElement('div');
    feedback.className = 'feedback';
    feedback.hidden = true;
    feedback.innerHTML = `<h4>Self-check key points</h4><p>${key}</p>`;
    card.append(legend, area, feedback);
    questions.append(card);
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    let score = 0;
    set.mc.forEach((item, index) => {
      const chosen = [...form.querySelectorAll(`[name="q${index + 1}"]:checked`)].map(input => input.value).sort().join('');
      const correct = item[2].split('').sort().join('');
      const isCorrect = chosen === correct;
      if (isCorrect) score++;
      const card = form.querySelectorAll('.quiz-item')[index];
      const feedback = card.querySelector('.feedback');
      feedback.hidden = false;
      feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
      const chosenText = chosen ? `Your answer: ${chosen.split('').join(', ')}.` : 'You left this blank.';
      feedback.innerHTML = `<h4>${isCorrect ? 'Correct' : 'Review this one'} · Answer: ${item[2].split('').join(', ')}</h4><p>${chosenText} ${item[3]}</p>`;
    });
    set.written.forEach(([, key], index) => {
      const card = form.querySelectorAll('.written')[index];
      const feedback = card.querySelector('.feedback');
      feedback.hidden = false;
    });
    result.innerHTML = `<h2>Your score: ${score} / 20</h2><p>${score >= 16 ? 'Strong work. Review any missed explanations and check your written responses.' : 'Review the explanations for missed questions, then retry after studying the topic.'} The five written responses are for self-assessment and are not included in this score.</p>`;
    result.hidden = false;
    form.querySelectorAll('input, textarea, button').forEach(control => control.disabled = true);
    result.scrollIntoView({behavior: 'smooth', block: 'start'});
  });
})();
