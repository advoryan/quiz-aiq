(function(){
  const DEFAULTS = {
    prizes: [
      '10% Off Your Next Purchase!',
      'Free Shipping on Your Order!',
      'Exclusive Product Recommendation!',
      '$5 Gift Card!'
    ],
    wheelImageUrl: 'https://d31j9hgdva1w9a.cloudfront.net/svg/spinner/free-wheel.svg',
    storageKey: 'spin_has_played',
    disableAfterFirstPlay: true,
    confettiDuration: 4500,
  themeColor: '#ff6200',
  closeOnBackdropClick: true
  };

  const STYLES = `
  .sw-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);display:none;align-items:center;justify-content:center;z-index:999999}
  .sw-backdrop.show{display:flex}
  .sw-modal{position:relative;background:#fff;width:min(92vw,480px);border-radius:12px;padding:18px 18px 20px;box-shadow:0 10px 30px rgba(0,0,0,.25);font-family:Arial,Helvetica,sans-serif}
  .sw-modal.win{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(92vw,520px);border:2px solid var(--sw-color,#ff6200);box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 6px rgba(255,98,0,.15);background:linear-gradient(180deg,#ffffff 0%,#ffffff 60%,#fff6e5 100%);animation:sw-pop .22s ease-out}
  .sw-dim{filter:blur(2px) brightness(.95);opacity:.7;pointer-events:none}
  .sw-title{margin:0 0 6px;font-size:22px}
  .sw-text{margin:0 0 14px;color:#444}
  .sw-close{position:absolute;right:10px;top:10px;border:none;background:transparent;font-size:20px;cursor:pointer;line-height:1}
  .sw-wheel-wrap{position:relative;display:flex;flex-direction:column;align-items:center;gap:12px}
  .sw-wheel-container{position:relative;width:300px;height:300px}
  .sw-pointer{position:absolute;top:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:16px solid var(--sw-color,#ff6200);filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));z-index:2}
  .sw-wheel{width:100%;height:100%;transition:transform 3s ease-out;border-radius:50%;border:4px solid #2e7d32;box-shadow:0 2px 10px rgba(0,0,0,.2);overflow:hidden;display:flex;align-items:center;justify-content:center;}
  .sw-wheel-img{width:106%;height:106%;border-radius:50%}
  .sw-actions{display:flex;justify-content:center}
  .sw-btn{padding:10px 14px;border:none;border-radius:6px;cursor:pointer;font-weight:600}
  .sw-btn.primary{background:var(--sw-color,#ff6200);color:#fff}
  .sw-btn:disabled{background:#ccc;cursor:not-allowed}
  .sw-form{display:none;grid-template-columns:1fr;gap:10px;margin-top:6px}
  .sw-form label{font-size:14px;color:#333}
  .sw-input{padding:10px;border:1px solid #ddd;border-radius:6px;font-size:14px;width:100%}
  .sw-row{display:flex;gap:10px}
  .sw-status{display:none;color:#2e7d32;font-weight:600;margin-top:8px}
  .sw-confetti{position:fixed;inset:0;pointer-events:none;z-index:999998}
  .sw-win-badge{font-size:42px;width:64px;height:64px;border-radius:50%;background:#fff3e8;color:var(--sw-color,#ff6200);display:flex;align-items:center;justify-content:center;margin:-12px auto 6px;box-shadow:0 4px 12px rgba(0,0,0,.1)}
  @keyframes sw-pop{0%{transform:translate(-50%,-50%) scale(.9);opacity:0}100%{transform:translate(-50%,-50%) scale(1);opacity:1}}
  `;

  function ensureStyles(themeColor){
    if(document.getElementById('sw-styles')) return;
    const style = document.createElement('style');
    style.id = 'sw-styles';
    style.textContent = STYLES;
    document.head.appendChild(style);
    document.documentElement.style.setProperty('--sw-color', themeColor || DEFAULTS.themeColor);
  }

  function createDom(opts){
    const backdrop = document.createElement('div');
    backdrop.className = 'sw-backdrop';
    backdrop.id = 'sw-backdrop';
    backdrop.setAttribute('aria-hidden','true');

    const canvas = document.createElement('canvas');
    canvas.className = 'sw-confetti';
    canvas.id = 'sw-confetti';
    backdrop.appendChild(canvas);

    // Spin modal (wheel)
    const spinModal = document.createElement('div');
    spinModal.className = 'sw-modal';
    spinModal.setAttribute('role','dialog');
    spinModal.setAttribute('aria-modal','true');
    spinModal.setAttribute('aria-labelledby','sw-title-spin');

    const closeSpinBtn = document.createElement('button');
    closeSpinBtn.className = 'sw-close';
    closeSpinBtn.setAttribute('aria-label','Close');
    closeSpinBtn.textContent = '×';
    spinModal.appendChild(closeSpinBtn);

    const h2Spin = document.createElement('h2');
    h2Spin.className = 'sw-title';
    h2Spin.id = 'sw-title-spin';
    h2Spin.textContent = 'Spin to win!';
    spinModal.appendChild(h2Spin);

    const pSpin = document.createElement('p');
    pSpin.className = 'sw-text';
    pSpin.id = 'sw-text-spin';
    pSpin.textContent = 'Try your luck and claim your prize!';
    spinModal.appendChild(pSpin);

    const wrapSpin = document.createElement('div');
    wrapSpin.className = 'sw-wheel-wrap';
    const container = document.createElement('div');
    container.className = 'sw-wheel-container';
    const pointer = document.createElement('div');
    pointer.className = 'sw-pointer';
    const wheel = document.createElement('div');
    wheel.className = 'sw-wheel';
    wheel.id = 'sw-wheel';
    const img = document.createElement('img');
    img.className = 'sw-wheel-img';
    img.src = opts.wheelImageUrl;
    img.alt = 'Spinning Wheel';
    wheel.appendChild(img);
    container.appendChild(pointer);
    container.appendChild(wheel);
    wrapSpin.appendChild(container);

    const actions = document.createElement('div');
    actions.className = 'sw-actions';
    const spinBtn = document.createElement('button');
    spinBtn.className = 'sw-btn primary';
    spinBtn.id = 'sw-spin';
    spinBtn.textContent = 'Spin to Win!';
    actions.appendChild(spinBtn);
    wrapSpin.appendChild(actions);
    spinModal.appendChild(wrapSpin);

    // Win modal (message + form)
  const winModal = document.createElement('div');
  winModal.className = 'sw-modal win';
    winModal.setAttribute('role','dialog');
    winModal.setAttribute('aria-modal','true');
    winModal.setAttribute('aria-labelledby','sw-title-win');
    winModal.style.display = 'none';

    const closeWinBtn = document.createElement('button');
    closeWinBtn.className = 'sw-close';
    closeWinBtn.setAttribute('aria-label','Close');
    closeWinBtn.textContent = '×';
    winModal.appendChild(closeWinBtn);

  const badge = document.createElement('div');
  badge.className = 'sw-win-badge';
  badge.textContent = '🏆';
  winModal.appendChild(badge);

  const h2Win = document.createElement('h2');
    h2Win.className = 'sw-title';
    h2Win.id = 'sw-title-win';
    h2Win.textContent = 'You won!';
    winModal.appendChild(h2Win);

    const pWin = document.createElement('p');
    pWin.className = 'sw-text';
    pWin.id = 'sw-text-win';
    pWin.textContent = 'Prize: ...';
    winModal.appendChild(pWin);

    const form = document.createElement('form');
    form.className = 'sw-form';
    form.id = 'sw-form';
    form.style.display = 'grid';
    form.innerHTML = `
      <div>
        <label for="sw-email">Email</label>
        <input id="sw-email" name="email" type="email" class="sw-input" placeholder="Enter your email" required />
      </div>
      <div class="sw-row">
        <div style="flex:1">
          <label for="sw-phone">Phone</label>
          <input id="sw-phone" name="phone" type="tel" class="sw-input" placeholder="Enter your phone" pattern="[0-9+()\\-\\s]{7,}" required />
        </div>
        <div style="width:40%">
          <label for="sw-zip">ZIP</label>
          <input id="sw-zip" name="zip" type="text" class="sw-input" placeholder="ZIP" pattern="[A-Za-z0-9\\-\\s]{3,10}" required />
        </div>
      </div>
      <div class="sw-actions">
        <button type="submit" class="sw-btn primary">Claim prize</button>
      </div>
    `;
    winModal.appendChild(form);

    const status = document.createElement('p');
    status.className = 'sw-status';
    status.id = 'sw-status';
    status.textContent = 'Thank you! We received your info.';
    winModal.appendChild(status);

    backdrop.appendChild(spinModal);
    backdrop.appendChild(winModal);
    document.body.appendChild(backdrop);

    return {
      backdrop,
      canvas,
      // spin modal elements
      spinModal,
      spinBtn,
      wheel,
      h2Spin,
      pSpin,
      // win modal elements
      winModal,
      h2Win,
      pWin,
      form,
      status,
      closeSpinBtn,
      closeWinBtn,
    };
  }

  function makeConfetti(canvas){
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let pieces = []; let running = false;
    function onResize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    window.addEventListener('resize', onResize);
    const colors = ['#f94144','#f3722c','#f8961e','#f9844a','#f9c74f','#90be6d','#43aa8b','#577590'];
    function spawn(n=120){
      pieces = Array.from({length:n}).map(()=>({
        x: Math.random()*W,
        y: -20 - Math.random()*H*0.5,
        w: 8 + Math.random()*6,
        h: 8 + Math.random()*10,
        r: Math.random()*2*Math.PI,
        vX: -1 + Math.random()*2,
        vY: 2 + Math.random()*3,
        vR: -0.1 + Math.random()*0.2,
        color: colors[Math.floor(Math.random()*colors.length)]
      }));
    }
    function draw(){
      ctx.clearRect(0,0,W,H);
      pieces.forEach(p=>{
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle=p.color; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore();
        p.x+=p.vX; p.y+=p.vY; p.r+=p.vR;
        if (p.y>H+20) p.y = -20; if (p.x<-20) p.x = W+20; if (p.x>W+20) p.x = -20;
      });
    }
    function loop(){ if(!running) return; draw(); requestAnimationFrame(loop); }
    return { start(durationMs=4000){ spawn(); running=true; loop(); setTimeout(()=>{running=false; ctx.clearRect(0,0,W,H)}, durationMs); } };
  }

  function mount(options={}){
    const opts = { ...DEFAULTS, ...options };
    ensureStyles(opts.themeColor);
  const { backdrop, canvas, spinModal, spinBtn, wheel, h2Spin, pSpin, winModal, h2Win, pWin, form, status, closeSpinBtn, closeWinBtn } = createDom(opts);
    const confetti = makeConfetti(canvas);

    let currentAngle = 0;
    let isSpinning = false;
    const anglePerPrize = 360 / opts.prizes.length;
    const storageKey = opts.storageKey;
    let hasPlayed = opts.disableAfterFirstPlay && (localStorage.getItem(storageKey) === 'true');

    function showSpin(){
      spinModal.style.display = '';
      winModal.style.display = 'none';
      spinModal.classList.remove('sw-dim');
      // reset view on spin modal
      h2Spin.textContent = 'Spin to win!';
      pSpin.textContent = 'Try your luck and claim your prize!';
      if (opts.disableAfterFirstPlay && hasPlayed){
        spinBtn.disabled = true;
        spinBtn.textContent = 'Thanks for playing!';
      } else {
        spinBtn.disabled = false;
        spinBtn.textContent = 'Spin to Win!';
      }
    }

    function open(){
      backdrop.classList.add('show');
      backdrop.setAttribute('aria-hidden','false');
      // initial state: show spin modal
      status.style.display = 'none';
      form.reset();
      showSpin();
    }
    function close(){
      backdrop.classList.remove('show');
      backdrop.setAttribute('aria-hidden','true');
    }

    // Close button
    closeSpinBtn.addEventListener('click', close);
    closeWinBtn.addEventListener('click', close);
    // Clicking backdrop closes (configurable)
    if (opts.closeOnBackdropClick) {
      backdrop.addEventListener('click', (e)=>{ if (e.target === backdrop) close(); });
    }

    // Spin logic
    spinBtn.addEventListener('click', ()=>{
      if (isSpinning || (opts.disableAfterFirstPlay && hasPlayed)) return;
      isSpinning = true; spinBtn.disabled = true;
      const prizeIndex = Math.floor(Math.random() * opts.prizes.length);
      const prizeAngleCenter = prizeIndex * anglePerPrize + anglePerPrize/2;
      const randomRotations = Math.floor(Math.random()*3)+3;
      const targetAngle = currentAngle + randomRotations*360 + (360 - (currentAngle % 360) - prizeAngleCenter);
      wheel.style.transition = 'transform 3s ease-out';
      wheel.style.transform = `rotate(${targetAngle}deg)`;
      const onEnd = ()=>{
        wheel.removeEventListener('transitionend', onEnd);
        const normalized = ((targetAngle % 360) + 360) % 360;
        wheel.style.transition = 'none';
        wheel.style.transform = `rotate(${normalized}deg)`;
        void wheel.offsetWidth;
        currentAngle = normalized;
  // Celebrate and show win modal (keep spin modal open under it)
        confetti.start(opts.confettiDuration);
        // update win modal text
        h2Win.textContent = 'You won!';
        pWin.textContent = `Prize: ${opts.prizes[prizeIndex]}`;
  // show win modal on top and dim the spin modal
  winModal.style.display = '';
  spinModal.classList.add('sw-dim');
        status.style.display = 'none';
        if (opts.disableAfterFirstPlay){ hasPlayed = true; localStorage.setItem(storageKey, 'true'); }
        isSpinning = false;
      };
      wheel.addEventListener('transitionend', onEnd);
    });

    // Claim form submit
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      status.style.display = 'block';
  setTimeout(()=>{ status.style.display = 'none'; close(); }, 1200);
    });

    return { open, close };
  }

  // Public API
  window.SpinWheelModal = {
    open(options){
      // Recreate per open to avoid state leakage across different pages/uses
      const instance = mount(options || {});
      instance.open();
      return instance;
    }
  };
})();
