document.addEventListener('DOMContentLoaded', () => {
  const questions = [
    {
      image: 'images/qBAF1yv66Xaw.png',
      text: 'Quando pensa na Pampers, qual a primeira palavra que vem à sua mente?',
      options: ['Conforto', 'Segurança']
    },
    {
      image: 'images/qBAF1yv66Xaw.png',
      text: 'Qual imagem você associa à Pampers?',
      options: ['Bebês confortáveis', 'Qualidade']
    },
    {
      image: 'images/qBAF1yv66Xaw.png',
      text: 'Como você prefere usar as fraldas da Pampers?',
      options: ['Para presentear', 'Para meu filho(a)']
    },
    {
      image: 'images/qBAF1yv66Xaw.png',
      text: 'Qual produto da Pampers faz sua criança se sentir mais acolhido(a)?',
      options: ['Fraldas', 'Lenços Umedecidos']
    },
    {
      image: 'images/qBAF1yv66Xaw.png',
      text: 'Com quem você adora compartilhar os produtos da Pampers?',
      options: ['Meus filhos', 'Outras crianças']
    },
    {
      image: 'images/qBAF1yv66Xaw.png',
      text: 'Quais outras marcas de fralda você ja testou?',
      options: ['Huggies', 'Babysec', 'MamyPoko']
    }
  ];

  let currentIndex = 0;
  const answers = [];

  // DOM nodes
  const questionCounter   = document.getElementById('questionCounter');
  const progress          = document.getElementById('progress');
  const questionImage     = document.getElementById('questionImage');
  const questionText      = document.getElementById('questionText');
  const quizCard          = document.querySelector('.quiz-card');
  const quizContainer     = document.querySelector('main.quiz-container');
  const analyzingScreen   = document.getElementById('analyzingScreen');
  const resultScreen      = document.getElementById('resultScreen');
  const redeemBtn         = document.getElementById('redeemBtn');

  function showQuestion() {
    const q = questions[currentIndex];

    function goNext() {
      if (currentIndex < questions.length - 1) {
        currentIndex++;
        showQuestion();
      } else {
        // esconde quiz e mostra “Analisando”
        quizContainer.style.display   = 'none';
        analyzingScreen.style.display = 'block';

        // após 3 segundos, oculta análise e exibe resultado
        setTimeout(() => {
          analyzingScreen.style.display = 'none';
          showResult();
        }, 3000);
      }
    }

    // atualiza contador e barra
    questionCounter.textContent = `Pergunta ${currentIndex + 1} de ${questions.length}`;
    progress.style.width        = `${((currentIndex + 1) / questions.length) * 100}%`;

    // exibe imagem, se houver
    if (q.image) {
      questionImage.src           = q.image;
      questionImage.style.display = 'block';
    } else {
      questionImage.style.display = 'none';
    }

    // exibe texto
    questionText.textContent = q.text;

    // remove opções antigas
    const oldOpts = quizCard.querySelector('.options');
    if (oldOpts) oldOpts.remove();

    // monta novas opções
    const opts = document.createElement('div');
    opts.className = 'options';
    q.options.forEach(optText => {
      const label = document.createElement('label');
      label.className = 'option';
      label.innerHTML = `
        <input type="radio" name="quiz-option" value="${optText}" />
        ${optText}
      `;
      opts.appendChild(label);
    });
    quizCard.appendChild(opts);

    // ao selecionar, salva resp. e avança
    opts.querySelectorAll('input').forEach(radio => {
      radio.onchange = () => {
        answers[currentIndex] = radio.value;
        goNext();
      };
    });
  }

  function showResult() {
    // esconde quiz
    quizContainer.style.display = 'none';
    // mostra resultado
    resultScreen.style.display  = 'block';
    resultScreen.scrollIntoView({ behavior: 'smooth' });
  }

  // pré-seleção de tamanho via ?size=XX (permanece igual)
  const params     = new URLSearchParams(window.location.search);
  const sizeParam  = params.get('size');
  if (sizeParam) {
    document.querySelectorAll('.size-selection .size-option').forEach(opt => {
      opt.classList.toggle('selected', opt.dataset.size === sizeParam);
    });
  }

  // =========================
  // PROPAGAÇÃO DE LEAD + UTMs
  // =========================

  // 1) Coleta lead da URL ou sessionStorage
  const qs = new URLSearchParams(location.search);
  let leadName  = qs.get('name')  || '';
  let leadPhone = qs.get('phone') || '';
  let selectedSize = sizeParam || '';

  try {
    if (leadName || leadPhone) {
      sessionStorage.setItem('lead', JSON.stringify({ name: leadName, phone: leadPhone }));
    } else {
      const cached = JSON.parse(sessionStorage.getItem('lead') || '{}');
      leadName  = leadName  || cached.name  || '';
      leadPhone = leadPhone || cached.phone || '';
    }
  } catch(e){}

  // 2) Quais chaves de UTM manter
  const keepKeys = /^(utm_|gclid$|fbclid$|msclkid$|yclid$|ttclid$|sck$|xcod$|ref$|campaign|ad(set|)_?id|creative|term)$/i;

  // 3) Função para decorar URLs mantendo UTMs + lead + size
  function decorateUrl(rawUrl, extra = {}) {
    const dest = new URL(rawUrl, location.href);

    // adiciona UTMs da página atual (sem sobrescrever se já existir no link)
    const cur = new URL(location.href);
    cur.searchParams.forEach((v, k) => {
      if (keepKeys.test(k) && !dest.searchParams.has(k)) {
        dest.searchParams.set(k, v);
      }
    });

    // adiciona lead/size
    if (leadName)  dest.searchParams.set('name',  leadName);
    if (leadPhone) dest.searchParams.set('phone', leadPhone);
    if (extra.size || selectedSize) dest.searchParams.set('size', extra.size || selectedSize);

    return dest.toString();
  }

  // 4) Decora o botão principal de checkout
  if (redeemBtn) {
    redeemBtn.href = decorateUrl(redeemBtn.href);
  }

  // 5) Atualiza o href quando o usuário escolhe um tamanho
  document.querySelectorAll('.size-selection .size-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.size-selection .size-option')
        .forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedSize = opt.dataset.size;
      if (redeemBtn) {
        redeemBtn.href = decorateUrl(redeemBtn.href, { size: selectedSize });
      }
    });
  });

  // 6) (Opcional) Propaga para todos os links internos da página
  document.querySelectorAll('a[href]').forEach(a => {
    try {
      const u = new URL(a.href, location.href);
      if (u.hostname === location.hostname) {
        a.href = decorateUrl(u.href);
      }
    } catch {}
  });

  // inicia o quiz
  showQuestion();
});
