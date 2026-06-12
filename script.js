let currentQuestion = 0;
let score = 0;
let questions = [];

fetch("./questions.json")
  .then(res => res.json())
  .then(data => {
    let shuffled = shuffleArray(data);
    questions = shuffled.slice(0, 60); // randomize & limit to 60
    showQuestion();
  })
  .catch(err => console.error("Error loading questions:", err));

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showQuestion() {
  if (currentQuestion >= questions.length) {
    document.getElementById("question").innerText = "🎉 Quiz finished!";
    document.getElementById("options").innerHTML = "";
    document.getElementById("pagination").innerText = "";
    document.getElementById("next-btn").style.display = "none";
    return;
  }

  let q = questions[currentQuestion];
  document.getElementById("question").innerText = q.question;

  let optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  // Multiple answers → checkboxes
  if (Array.isArray(q.answer) && q.answer.length > 1) {
    q.options.forEach(opt => {
      let label = document.createElement("label");
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = opt;
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(opt));
      optionsDiv.appendChild(label);
      optionsDiv.appendChild(document.createElement("br"));
    });

    let submitBtn = document.createElement("button");
    submitBtn.innerText = "Submit Answer";
    submitBtn.onclick = () => {
      let selected = Array.from(optionsDiv.querySelectorAll("input:checked")).map(cb => cb.value);
      checkMultipleAnswer(selected, q.answer);

      // Disable all checkboxes after submission
      optionsDiv.querySelectorAll("input[type=checkbox]").forEach(cb => cb.disabled = true);
      submitBtn.disabled = true;
    };
    optionsDiv.appendChild(submitBtn);

  } else {
    // Single answer → buttons
    q.options.forEach(opt => {
      let btn = document.createElement("button");
      btn.innerText = opt;
      btn.onclick = () => {
        checkAnswer(opt, q.answer);

        // Disable all buttons after one is clicked
        optionsDiv.querySelectorAll("button").forEach(b => b.disabled = true);
      };
      optionsDiv.appendChild(btn);
    });
  }

  // Pagination display
  document.getElementById("pagination").innerText = `Question ${currentQuestion + 1} of ${questions.length}`;

  // Score display
  document.getElementById("score").innerText = `Score: ${score}/${questions.length}`;
}

function checkAnswer(selected, correct) {
  if (selected === correct) {
    score++;
    document.getElementById("message").innerHTML = "✅ Correct!";
  } else {
    document.getElementById("message").innerHTML = "❌ Incorrect. Correct answer: " + correct;
  }
}

function checkMultipleAnswer(selected, correctAnswers) {
  let selectedSet = new Set(selected);
  let correctSet = new Set(correctAnswers);

  if (selectedSet.size === correctSet.size && [...selectedSet].every(val => correctSet.has(val))) {
    score++;
    document.getElementById("message").innerHTML = "✅ Correct!";
  } else {
    document.getElementById("message").innerHTML = "❌ Incorrect. Correct answers: " + correctAnswers.join(", ");
  }
}

document.getElementById("next-btn").onclick = () => {
  currentQuestion++;
  showQuestion();
  document.getElementById("message").innerHTML = ""; // Clear message for next question
};