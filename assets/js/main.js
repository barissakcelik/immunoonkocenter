/* İmmuno Onko Center — Ortak Script (harici kütüphane kullanmaz) */
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Yapışkan menüde gölge
  var header = document.querySelector('.site-header');
  var onScroll = function () { if (header) header.classList.toggle('is-scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobil menü
  var toggle = document.querySelector('.nav__toggle');
  var mobile = document.getElementById('mobile-menu');
  if (toggle && mobile) {
    var setMenu = function (open) {
      mobile.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
      toggle.innerHTML = open ? '<i class="fas fa-xmark" aria-hidden="true"></i>' : '<i class="fas fa-bars" aria-hidden="true"></i>';
    };
    toggle.addEventListener('click', function () { setMenu(!mobile.classList.contains('is-open')); });
    mobile.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1080) setMenu(false); });
  }

  // Açılır menü (dokunmatik ve klavye desteği)
  document.querySelectorAll('.dropdown').forEach(function (dd) {
    var btn = dd.querySelector('button');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !dd.classList.contains('is-open');
      dd.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function () { dd.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); });
  });

  // Kaydırınca beliren öğeler
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Yıl
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // İletişim formu → WhatsApp (sunucu tarafı olmadığı için güvenli yöntem)
  var form = document.getElementById('contact-form');
  if (form) {
    var WA_NUMBER = '905442642593';
    var clean = function (v, max) {
      return String(v || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F<>]/g, '').trim().slice(0, max);
    };
    var setError = function (name, show) {
      var f = form.querySelector('[name="' + name + '"]').closest('.field');
      f.classList.toggle('has-error', show);
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.website && form.website.value) return; // bot tuzağı
      var name = clean(form.name.value, 80);
      var phone = clean(form.phone.value, 20);
      var email = clean(form.email.value, 120);
      var msg = clean(form.message.value, 1500);
      var ok = true;
      var nameOk = name.length >= 3; setError('name', !nameOk); ok = ok && nameOk;
      var phoneOk = /^[0-9+()\s-]{10,20}$/.test(phone); setError('phone', !phoneOk); ok = ok && phoneOk;
      var emailOk = email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email); setError('email', !emailOk); ok = ok && emailOk;
      var msgOk = msg.length >= 10; setError('message', !msgOk); ok = ok && msgOk;
      var consent = form.consent.checked; form.consent.closest('.form__consent').style.color = consent ? '' : '#C23B3B';
      if (!ok || !consent) return;

      var text = 'Merhaba, web sitenizden ulaşıyorum.\n\n' +
        'Ad Soyad: ' + name + '\nTelefon: ' + phone + (email ? '\nE-posta: ' + email : '') + '\n\nMesaj: ' + msg;
      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
      var w = window.open(url, '_blank', 'noopener,noreferrer');
      if (!w) window.location.href = url;
      var status = document.getElementById('form-status');
      if (status) status.classList.add('is-visible');
      form.reset();
    });
  }
});
