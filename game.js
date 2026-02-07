const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    backgroundColor: '#1a1a2e',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 900 },
        debug: false
      }
    },
    scene: {
      preload,
      create,
      update
    }
  };
  
  const game = new Phaser.Game(config);
  
  let heart;
  let pipes;
  let scoreZones;
  let score = 0;
  let scoreText;
  let scoreIcon;
  let scorePanel;
  let gameOver = false;
  let gameStarted = false;
  
  // UI elements
  let titleTexts = [];
  let floatingHearts = [];
  let backgroundHearts = [];
  let particles;
  
  function preload() {
    this.load.image('heart', 'Red_Heart_PNG.png');
  }
  
  function create() {
    createBackgroundHearts.call(this);
    showTitleScreen.call(this);
  
    this.input.on('pointerdown', () => {
      if (!gameStarted) startGame.call(this);
      else if (!gameOver && heart) flap.call(this);
    });
  
    this.input.keyboard.on('keydown-SPACE', () => {
      if (!gameStarted) startGame.call(this);
      else if (!gameOver && heart) flap.call(this);
    });
  }
  
  function createBackgroundHearts() {
    // Create subtle floating hearts in background
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(0, 400);
      const y = Phaser.Math.Between(0, 600);
      const size = Phaser.Math.Between(12, 24);
      
      const bgHeart = this.add.text(x, y, '❤️', {
        fontSize: size + 'px',
        fill: '#ff4d6d'
      });
      bgHeart.setAlpha(0.1);
      
      backgroundHearts.push(bgHeart);
      
      // Gentle floating animation
      this.tweens.add({
        targets: bgHeart,
        y: y - 50,
        duration: Phaser.Math.Between(3000, 5000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      this.tweens.add({
        targets: bgHeart,
        alpha: { from: 0.05, to: 0.15 },
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }
  
  function showTitleScreen() {
    // Main title with glow effect
    const mainTitle = this.add.text(200, 120,
      'If you lose,',
      {
        fontSize: '32px',
        fill: '#ff4d6d',
        fontStyle: 'bold',
        align: 'center',
        stroke: '#ff1744',
        strokeThickness: 2
      }
    ).setOrigin(0.5);
    mainTitle.setShadow(0, 0, '#ff4d6d', 15, true, true);
    titleTexts.push(mainTitle);
  
    const subtitle = this.add.text(200, 180,
      'you need to be\nmy Valentine 💘',
      {
        fontSize: '28px',
        fill: '#ff6b9d',
        fontStyle: 'bold',
        align: 'center',
        stroke: '#ff1744',
        strokeThickness: 1
      }
    ).setOrigin(0.5);
    subtitle.setShadow(0, 0, '#ff4d6d', 10, true, true);
    titleTexts.push(subtitle);
  
    // Pulsing animation for title
    this.tweens.add({
      targets: [mainTitle, subtitle],
      scale: { from: 1, to: 1.05 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  
    // Names with decorative hearts
    const names = this.add.text(200, 280,
      '❤️ Vincent & Ashley ❤️\nValentine 2026',
      {
        fontSize: '22px',
        fill: '#ffffff',
        fontStyle: 'italic',
        align: 'center'
      }
    ).setOrigin(0.5);
    names.setShadow(2, 2, '#000000', 5, true, true);
    titleTexts.push(names);
  
    // Animated floating hearts around names
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const radius = 100;
      const x = 200 + Math.cos(angle) * radius;
      const y = 280 + Math.sin(angle) * radius;
      
      const floatingHeart = this.add.text(x, y, '💕', {
        fontSize: '20px'
      }).setOrigin(0.5);
      
      titleTexts.push(floatingHeart);
      floatingHearts.push(floatingHeart);
      
      this.tweens.add({
        targets: floatingHeart,
        y: y - 20,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: i * 200
      });
      
      this.tweens.add({
        targets: floatingHeart,
        alpha: { from: 0.6, to: 1 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
        delay: i * 200
      });
    }
  
    // Start instruction with fade animation
    const startText = this.add.text(200, 450,
      'Click or press SPACE to start',
      {
        fontSize: '18px',
        fill: '#ffb3c6',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);
    titleTexts.push(startText);
    
    this.tweens.add({
      targets: startText,
      alpha: { from: 0.4, to: 1 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  
    // Border decoration
    const topBorder = this.add.rectangle(200, 30, 360, 4, 0xff4d6d);
    topBorder.setStrokeStyle(2, 0xff1744);
    titleTexts.push(topBorder);
    
    const bottomBorder = this.add.rectangle(200, 570, 360, 4, 0xff4d6d);
    bottomBorder.setStrokeStyle(2, 0xff1744);
    titleTexts.push(bottomBorder);
  }
  
  function startGame() {
    gameStarted = true;
    
    // Fade out title screen
    titleTexts.forEach(t => {
      this.tweens.add({
        targets: t,
        alpha: 0,
        duration: 300,
        onComplete: () => t.destroy()
      });
    });
    floatingHearts = [];
  
    // Brief delay before starting
    this.time.delayedCall(300, () => {
      initializeGame.call(this);
    });
  }
  
  function initializeGame() {
    // ===== Heart Player with pulse animation =====
    heart = this.physics.add.sprite(100, 300, 'heart').setScale(0.01);
    heart.setCollideWorldBounds(true);
    
    // Pulsing heart animation
    this.tweens.add({
      targets: heart,
      scaleX: { from: 0.01, to: 0.012 },
      scaleY: { from: 0.01, to: 0.012 },
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  
    // ===== Groups =====
    pipes = this.physics.add.group();
    scoreZones = this.physics.add.group();
  
    // ===== Score display with heart icon =====
    score = 0;
    
    // Score background panel
    scorePanel = this.add.rectangle(75, 35, 120, 50, 0x2d2d44, 0.8);
    scorePanel.setStrokeStyle(3, 0xff4d6d);
    scorePanel.setDepth(10);
    
    scoreIcon = this.add.text(30, 20, '💖', {
      fontSize: '28px'
    }).setDepth(11);
    
    scoreText = this.add.text(65, 20, '0', {
      fontSize: '28px',
      fill: '#ffb3c6',
      fontStyle: 'bold',
      stroke: '#ff1744',
      strokeThickness: 2
    }).setDepth(11);
    scoreText.setShadow(2, 2, '#000000', 3, true, true);
  
    // ===== Particle emitter for scoring =====
    particles = this.add.particles(0, 0, 'heart', {
      speed: { min: 50, max: 150 },
      scale: { start: 0.003, end: 0 },
      lifespan: 800,
      gravityY: 100,
      emitting: false
    });
  
    // ===== Pipe spawner =====
    this.time.addEvent({
      delay: 1500,
      callback: addPipePair,
      callbackScope: this,
      loop: true
    });
  
    // ===== Collisions =====
    this.physics.add.collider(heart, pipes, hitPipe, null, this);
    this.physics.add.overlap(heart, scoreZones, scorePoint, null, this);
  }
  
  function update() {
    if (!gameStarted || gameOver || !heart) return;
  
    // Heart rotation based on velocity
    heart.rotation = Phaser.Math.Clamp(heart.body.velocity.y / 600, -0.4, 0.6);
  
    // Check boundaries
    if (heart.y <= 0 || heart.y >= 600) endGame.call(this);
  
    // Move pipes and score zones
    const speed = -200;
    pipes.children.entries.forEach(pipe => {
      if (pipe && pipe.active) {
        pipe.body.setVelocity(speed, 0);
        pipe.body.allowGravity = false;
        if (pipe.x + pipe.width < 0) {
          pipe.destroy();
        }
      }
    });
    
    scoreZones.children.entries.forEach(zone => {
      if (zone && zone.active) {
        zone.body.setVelocity(speed, 0);
        zone.body.allowGravity = false;
        if (zone.x + zone.width < 0) {
          zone.destroy();
        }
      }
    });
  }
  
  function flap() {
    if (!heart || gameOver) return;
    heart.body.setVelocityY(-300);
    
    // Small flap animation
    this.tweens.add({
      targets: heart,
      angle: -15,
      duration: 100,
      yoyo: true,
      ease: 'Quad.easeOut'
    });
  }
  
  function addPipePair() {
    if (gameOver) return;
  
    const gap = 160;
    const centerY = Phaser.Math.Between(150, 450);
    const speed = -200;
    const pipeWidth = 60;
  
    // ===== Top pipe with rounded candy style =====
    let topPipe = this.add.graphics();
    topPipe.fillGradientStyle(0xff8fab, 0xff8fab, 0xffc2d4, 0xffc2d4, 1);
    topPipe.fillRoundedRect(0, 0, pipeWidth, 600, 15);
    topPipe.lineStyle(4, 0xff6b9d, 1);
    topPipe.strokeRoundedRect(0, 0, pipeWidth, 600, 15);
    
    // Add shine effect
    topPipe.fillStyle(0xffffff, 0.3);
    topPipe.fillRoundedRect(5, 0, 15, 600, 10);
    
    topPipe.x = 400;
    topPipe.y = centerY - gap / 2 - 600;
    
    this.physics.add.existing(topPipe);
    topPipe.body.setSize(pipeWidth, 600);
    topPipe.body.setOffset(0, 0);
    topPipe.body.setImmovable(true);
    topPipe.body.allowGravity = false;
    topPipe.body.setVelocity(speed, 0);
    pipes.add(topPipe);
  
    // ===== Bottom pipe with rounded candy style =====
    let bottomPipe = this.add.graphics();
    bottomPipe.fillGradientStyle(0xffc2d4, 0xffc2d4, 0xff8fab, 0xff8fab, 1);
    bottomPipe.fillRoundedRect(0, 0, pipeWidth, 600, 15);
    bottomPipe.lineStyle(4, 0xff6b9d, 1);
    bottomPipe.strokeRoundedRect(0, 0, pipeWidth, 600, 15);
    
    // Add shine effect
    bottomPipe.fillStyle(0xffffff, 0.3);
    bottomPipe.fillRoundedRect(5, 0, 15, 600, 10);
    
    bottomPipe.x = 400;
    bottomPipe.y = centerY + gap / 2;
    
    this.physics.add.existing(bottomPipe);
    bottomPipe.body.setSize(pipeWidth, 600);
    bottomPipe.body.setOffset(0, 0);
    bottomPipe.body.setImmovable(true);
    bottomPipe.body.allowGravity = false;
    bottomPipe.body.setVelocity(speed, 0);
    pipes.add(bottomPipe);
  
    // ===== Score zone =====
    let scoreZone = this.add.rectangle(400 + pipeWidth / 2, 300, 2, 600, 0xffffff, 0);
    this.physics.add.existing(scoreZone);
    scoreZone.body.setSize(2, 600);
    scoreZone.body.setImmovable(true);
    scoreZone.body.allowGravity = false;
    scoreZone.body.setVelocity(speed, 0);
    scoreZone.setVisible(false);
    scoreZone.scored = false;
    scoreZones.add(scoreZone);
  }
  
  function scorePoint(_, zone) {
    if (zone.scored) return;
    zone.scored = true;
    score++;
    scoreText.setText(score.toString());
    
    // Particle burst at heart position
    particles.emitParticleAt(heart.x, heart.y, 10);
    
    // Score animation
    this.tweens.add({
      targets: [scoreText, scoreIcon],
      scale: { from: 1, to: 1.3 },
      duration: 150,
      yoyo: true,
      ease: 'Back.easeOut'
    });
    
    // Floating +1 text
    const plusOne = this.add.text(heart.x + 30, heart.y - 20, '+1', {
      fontSize: '24px',
      fill: '#ffeb3b',
      fontStyle: 'bold',
      stroke: '#ff6b00',
      strokeThickness: 3
    }).setDepth(20);
    
    this.tweens.add({
      targets: plusOne,
      y: plusOne.y - 50,
      alpha: 0,
      duration: 800,
      ease: 'Cubic.easeOut',
      onComplete: () => plusOne.destroy()
    });
  }
  
  function hitPipe() {
    endGame.call(this);
  }
  
  function endGame() {
    if (gameOver) return;
    gameOver = true;
  
    // Explosion effect at collision
    if (heart) {
      particles.emitParticleAt(heart.x, heart.y, 30);
      heart.destroy();
    }
    
    pipes.children.entries.forEach(p => p.destroy());
    scoreZones.children.entries.forEach(z => z.destroy());
    if (scoreText) scoreText.destroy();
    if (scoreIcon) scoreIcon.destroy();
    if (scorePanel) scorePanel.destroy();
  
    // Dark overlay
    const overlay = this.add.rectangle(200, 300, 400, 600, 0x000000, 0.7);
    
    // Decorative panel - larger size
    const panel = this.add.graphics();
    panel.fillStyle(0x2d2d44, 0.95);
    panel.fillRoundedRect(20, 100, 360, 400, 25);
    panel.lineStyle(5, 0xff4d6d, 1);
    panel.strokeRoundedRect(20, 100, 360, 400, 25);
  
    // Final score
    this.add.text(200, 180, 'Your final score:', {
      fontSize: '26px',
      fill: '#ffb3c6',
      fontStyle: 'italic'
    }).setOrigin(0.5);
    
    const finalScore = this.add.text(200, 230, score.toString(), {
      fontSize: '64px',
      fill: '#ff4d6d',
      fontStyle: 'bold',
      stroke: '#ff1744',
      strokeThickness: 4
    }).setOrigin(0.5);
    finalScore.setShadow(0, 0, '#ff4d6d', 20, true, true);
    
    this.tweens.add({
      targets: finalScore,
      scale: { from: 0, to: 1 },
      duration: 500,
      ease: 'Back.easeOut'
    });
  
    // Valentine message
    const valentineMsg = this.add.text(200, 320, '💘 You are now my Valentine! 💘', {
      fontSize: '24px',
      fill: '#ffb3c6',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#ff1744',
      strokeThickness: 2
    }).setOrigin(0.5);
    valentineMsg.setShadow(2, 2, '#000000', 6, true, true);
  
    // Large pulsing heart
    let finalHeart = this.add.text(200, 400, '❤️', {
      fontSize: '96px'
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: finalHeart,
      scale: { from: 1, to: 1.4 },
      rotation: { from: -0.2, to: 0.2 },
      yoyo: true,
      repeat: -1,
      duration: 700,
      ease: 'Sine.easeInOut'
    });
  
    // Falling hearts confetti
    for (let i = 0; i < 20; i++) {
      this.time.delayedCall(i * 100, () => {
        const confettiHeart = this.add.text(
          Phaser.Math.Between(60, 340),
          -20,
          ['❤️', '💕', '💖', '💗'][Phaser.Math.Between(0, 3)],
          { fontSize: Phaser.Math.Between(20, 40) + 'px' }
        );
        
        this.tweens.add({
          targets: confettiHeart,
          y: 620,
          rotation: Phaser.Math.Between(-2, 2),
          alpha: { from: 1, to: 0.3 },
          duration: Phaser.Math.Between(2000, 3500),
          ease: 'Sine.easeIn',
          onComplete: () => confettiHeart.destroy()
        });
        
        this.tweens.add({
          targets: confettiHeart,
          x: confettiHeart.x + Phaser.Math.Between(-30, 30),
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      });
    }
  
    // Restart instruction
    const restartText = this.add.text(200, 480, 'Refresh to play again', {
      fontSize: '18px',
      fill: '#bbbbbb',
      fontStyle: 'italic'
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: restartText,
      alpha: { from: 0.5, to: 1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }