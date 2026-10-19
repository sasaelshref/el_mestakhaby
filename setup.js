// إدارة التنقل بين واجهات الموقع
function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
}

// محاكاة نظام تسجيل الدخول أو إنشاء الحساب
function handleAuth(event) {
  event.preventDefault();
  const email = document.getElementById('emailInput').value;
  
  // تخزين بيانات المستخدم الوهمية لجلسة العمل
  localStorage.setItem('mestakhaby_user', email);
  
  // تجهيز لوحة التحكم
  document.getElementById('userNameDisplay').textContent = email.split('@')[0];
  const profileLink = window.location.origin + window.location.pathname + '?u=' + encodeURIComponent(email);
  document.getElementById('userProfileLink').value = profileLink;
  
  loadUserMessages();
  switchView('dashboardView');
}

// نسخ رابط الصفحة الشخصية
function copyLink() {
  const linkInput = document.getElementById('userProfileLink');
  linkInput.select();
  navigator.clipboard.writeText(linkInput.value);
  alert('تم نسخ الرابط بنجاح! شاركه مع أصحابك ✨');
}

// تسجيل الخروج
function logoutUser() {
  localStorage.removeItem('mestakhaby_user');
  switchView('homeView');
}

// إرسال رسالة مجهولة
function submitAnonymousMessage(event) {
  event.preventDefault();
  const text = document.getElementById('messageText').value;
  
  if(!text.trim()) return;

  // جلب الرسائل القديمة أو إنشاء مصفوفة جديدة وحفظها في التخزين المحلي
  let messages = JSON.parse(localStorage.getItem('mestakhaby_messages') || '[]');
  messages.unshift({ text: text, date: new Date().toLocaleDateString('ar-EG') });
  localStorage.setItem('mestakhaby_messages', JSON.stringify(messages));

  document.getElementById('messageText').value = '';
  document.getElementById('sendSuccess').classList.remove('hidden');
  
  setTimeout(() => {
    document.getElementById('sendSuccess').classList.add('hidden');
  }, 4000);
}

// تحميل الرسائل الواردة في لوحة التحكم
function loadUserMessages() {
  const messages = JSON.parse(localStorage.getItem('mestakhaby_messages') || '[]');
  const listContainer = document.getElementById('messagesList');
  document.getElementById('msgCount').textContent = messages.length;

  if (messages.length === 0) {
    listContainer.innerHTML = `<div class="empty-msg">لا توجد رسائل حتى الآن. شارك رابطك وابدأ تلقي الصراحة!</div>`;
    return;
  }

  listContainer.innerHTML = '';
  messages.forEach(msg => {
    const card = document.createElement('div');
    card.className = 'msg-card';
    card.innerHTML = `
      <p>${msg.text}</p>
      <small style="color: var(--text-muted); display: block; margin-top: 5px;">${msg.date}</small>
    `;
    listContainer.appendChild(card);
  });
}

// التحقق عند فتح الرابط إذا كان شخص يزور صفحة مستخدم آخر للإرسال
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const targetUser = urlParams.get('u');

  if (targetUser) {
    document.getElementById('targetName').textContent = `رسالة إلى: ${targetUser.split('@')[0]}`;
    switchView('sendView');
  } else {
    // التحقق إذا كان المستخدم مسجل مسبقاً
    const savedUser = localStorage.getItem('mestakhaby_user');
    if (savedUser) {
      document.getElementById('userNameDisplay').textContent = savedUser.split('@')[0];
      const profileLink = window.location.origin + window.location.pathname + '?u=' + encodeURIComponent(savedUser);
      document.getElementById('userProfileLink').value = profileLink;
      loadUserMessages();
      switchView('dashboardView');
    }
  }

  // إخفاء شاشة التحميل الأولية
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if(loader) loader.style.display = 'none';
  }, 500);
});