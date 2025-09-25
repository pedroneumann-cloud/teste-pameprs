// 1) Carrega Vidalytics no container
;(function (v, i, d, a, l, y, t, c, s) {
  y = '_' + d.toLowerCase(); c = d + 'L';
  if (!v[d]) v[d] = {};
  if (!v[c]) v[c] = {};
  if (!v[y]) v[y] = {};
  var vl = 'Loader',
      vli = v[y][vl],
      vsl = v[c][vl + 'Script'],
      vlf = v[c][vl + 'Loaded'],
      ve = 'Embed';
  if (!vsl) {
    vsl = function (u, cb) {
      if (t) { cb(); return; }
      s = i.createElement('script');
      s.type = 'text/javascript';
      s.async = 1;
      s.src = u;
      if (s.readyState) {
        s.onreadystatechange = function () {
          if (s.readyState === 'loaded' || s.readyState === 'complete') {
            s.onreadystatechange = null;
            vlf = 1;
            cb();
          }
        };
      } else {
        s.onload = function () {
          vlf = 1;
          cb();
        };
      }
      i.getElementsByTagName('head')[0].appendChild(s);
    };
  }
  vsl(
    l + 'loader.min.js',
    function () {
      if (!vli) {
        var vlc = v[c][vl];
        vli = new vlc();
      }
      vli.loadScript(
        l + 'player.min.js',
        function () {
          var vec = v[d][ve];
          t = new vec();
          t.run(a);
        }
      );
    }
  );
})(
  window,
  document,
  'Vidalytics',
  'vidalytics_embed_M0dNLz01c_l7XFZh',
  'https://fast.vidalytics.com/embeds/Vsu6ME85/M0dNLz01c_l7XFZh/'
);

// 2) Lógica de navegação, máscara e pop‑up
document.addEventListener('DOMContentLoaded', function() {
  // 2.1) Aparecer CTA após 30s
  setTimeout(function() {
    var cta = document.getElementById('ctaWrapper');
    if (cta) cta.style.display = 'block';
  }, 60000);

  // 2.2) Avançar da VSL → Form
  var ctaBtn = document.getElementById('vslCta');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', function() {
      document.getElementById('step1').style.display = 'none';
      document.getElementById('step2').style.display = 'block';
      document.getElementById('step2').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 2.3) Máscara de WhatsApp (formatação BR)
  var whatsappInput = document.getElementById('leadWhatsapp');
  if (whatsappInput) {
    whatsappInput.addEventListener('input', function() {
      var v = this.value.replace(/\D/g,'').slice(0,11);
      var ddd   = v.slice(0,2);
      var part1 = v.slice(2,7);
      var part2 = v.slice(7,11);
      var out = '';
      if (ddd)   out += '(' + ddd + ')';
      if (part1) out += part1;
      if (part2) out += '-' + part2;
      this.value = out;
    });
  }

  // 2.4) Envio do form → pop‑up
// 2.4) Envio do form → redirecionar com dados
  var leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const nome = document.getElementById('leadName').value.trim();
      const whatsapp = document.getElementById('leadWhatsapp').value.replace(/\D+/g, '');

      // salva no sessionStorage como backup
      try {
        sessionStorage.setItem('lead', JSON.stringify({ name: nome, phone: whatsapp }));
      } catch (err) {}

      // define próximo passo (pode ser perguntas.html, upsell.html ou checkout)
      const nextURL = `../index/index.html?name=${encodeURIComponent(nome)}&phone=${encodeURIComponent(whatsapp)}`;
window.location.href = nextURL;
    });
  }


  // 2.5) Fechar pop‑up
  var modalClose = document.getElementById('modalClose');
  if (modalClose) {
    modalClose.addEventListener('click', function() {
      document.getElementById('popupModal').style.display = 'none';
      // Aqui você inicia a Etapa&nbsp;3 (seleção de tamanho)…
      // document.getElementById('step2').style.display = 'none';
      // document.getElementById('step3').style.display = 'block';
      // document.getElementById('step3').scrollIntoView({ behavior:'smooth' });
    });
  }
});

  // 2.6) Preparar Step&nbsp;3
  var step3     = document.getElementById('step3');
  var finish3   = document.getElementById('finishStep3');
  var selectedSize = '';
  var selectedAge  = '';

  // 2.7) Ao fechar o modal, mostrar Step&nbsp;3
  document.getElementById('modalClose').addEventListener('click', function() {
    document.getElementById('popupModal').style.display = 'none';
    document.getElementById('step2').style.display     = 'none';
    step3.style.display                                = 'block';
    step3.scrollIntoView({ behavior: 'smooth' });
  });

  // 2.8) Seleção de tamanho
  document.querySelectorAll('#step3 .size-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.querySelectorAll('#step3 .size-option')
        .forEach(function(o){ o.classList.remove('selected'); });
      opt.classList.add('selected');
      selectedSize = opt.dataset.size;
      validateStep3();
    });
  });

  // 2.9) Seleção de idade
  document.querySelectorAll('#step3 .age-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.querySelectorAll('#step3 .age-option')
        .forEach(function(o){ o.classList.remove('selected'); });
      opt.classList.add('selected');
      selectedAge = opt.dataset.age;
      validateStep3();
    });
  });

  // 2.10) Habilita botão somente quando ambos selecionados
  function validateStep3() {
    if (selectedSize && selectedAge) {
      finish3.disabled = false;
    } else {
      finish3.disabled = true;
    }
  }

  // 2.11) Ao clicar em “Continuar” -> prossiga para onde precisar
  finish3.addEventListener('click', function() {
  // adiciona size=RN ou size=P, etc. na query string
  const target = `../index/index.html?size=${encodeURIComponent(selectedSize)}`;
  window.location.href = target;
});

