class Obstacle {
    constructor(canvas, gameState, frameCount) {
        this.id = Date.now() + Math.random(); // Unique ID
        this.canvas = canvas;
        this.gameState = gameState;
        this.top = Math.floor(Math.random() * 200) + 50;
        this.bottom = canvas.height - (this.top + 200);
        this.x = canvas.width;
        this.width = 30;
        
        // Calculate speeds as percentage of canvas width for consistent experience across devices
        this.speed = canvas.width * 0.003; // 0.3% of canvas width ≈ 1.2px at 400px
        this.bulletSpeed = canvas.width * 0.005; // 0.5% of canvas width ≈ 2px at 400px
        
        this.hasGun = Math.random() < 0.4; // 40% chance of having a gun
        this.lastShot = frameCount;
        this.enemyBullets = [];
        this.passed = false;
        this.isDestroying = false;
        this.destructionProgress = 0;
        this.destructionSpeed = 0.1;
        
        // Visual design properties
        this.type = Math.floor(Math.random() * 4); // 4 different visual styles
        this.animationOffset = Math.random() * Math.PI * 2; // Random animation start
        this.particles = [];
        this.crystalRotation = 0;
        this.energyPulse = 0;
        
        // Initialize particles for energy effects
        this.initializeParticles();
    }

    initializeParticles() {
        // Create floating energy particles
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                offsetY: Math.random() * 100,
                offsetX: Math.random() * this.width,
                speed: 0.5 + Math.random() * 1.5,
                size: 1 + Math.random() * 2,
                alpha: 0.3 + Math.random() * 0.7
            });
        }
    }

    update(frameCount, deltaMultiplier = 1) {
        // Don't move if being destroyed
        if (this.isDestroying) return;
        
        this.x -= this.speed * deltaMultiplier;
        
        // Update animation properties
        this.crystalRotation += 0.02 * deltaMultiplier;
        this.energyPulse = Math.sin(frameCount * 0.05 + this.animationOffset) * 0.5 + 0.5;
        
        // Update particles
        this.particles.forEach(p => {
            p.offsetY += p.speed * deltaMultiplier;
            if (p.offsetY > this.top) {
                p.offsetY = 0;
            }
        });

        // Update enemy bullets
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            this.enemyBullets[i].x -= this.bulletSpeed * deltaMultiplier;
            this.enemyBullets[i].y += Math.sin(this.enemyBullets[i].x / 50) * 2 * deltaMultiplier; // Wavy bullet pattern

            // Remove bullets that are off screen
            if (this.enemyBullets[i].x < 0) {
                this.enemyBullets.splice(i, 1);
            }
        }

        // Shoot if has gun
        if (this.hasGun && frameCount - this.lastShot > 120) { // Shoot every 120 frames
            this.enemyBullets.push({
                x: this.x + this.width/2,
                y: this.top + 20
            });
            this.lastShot = frameCount;
        }
    }

    draw(ctx) {
        // Don't draw if fully destroyed
        if (this.destructionProgress >= 1) return;

        // Create destruction effect
        if (this.isDestroying) {
            this.drawDestructionEffect(ctx);
            this.destructionProgress += this.destructionSpeed;
            return;
        }

        // Draw different obstacle types
        switch(this.type) {
            case 0:
                this.drawCrystalBarrier(ctx);
                break;
            case 1:
                this.drawEnergyGate(ctx);
                break;
            case 2:
                this.drawPlasmaBeams(ctx);
                break;
            case 3:
                this.drawHolographicWalls(ctx);
                break;
        }

        // Draw machine gun if pipe has one
        if (this.hasGun) {
            this.drawGun(ctx);
        }

        // Draw enemy bullets
        this.drawEnemyBullets(ctx);

        // Add hit counter display
        this.drawHitCounter(ctx);
    }

    drawCrystalBarrier(ctx) {
        // Rotating crystal structures
        const numCrystals = 5;
        
        // Top barrier
        for (let i = 0; i < numCrystals; i++) {
            const y = (this.top / numCrystals) * i + (this.top / numCrystals / 2);
            this.drawCrystal(ctx, this.x + this.width/2, y, 15, this.crystalRotation + i);
        }
        
        // Bottom barrier
        for (let i = 0; i < numCrystals; i++) {
            const y = this.canvas.height - this.bottom + (this.bottom / numCrystals) * i + (this.bottom / numCrystals / 2);
            this.drawCrystal(ctx, this.x + this.width/2, y, 15, -this.crystalRotation - i);
        }
        
        // Connection line with particles
        ctx.save();
        ctx.strokeStyle = `rgba(102, 204, 255, ${0.3 + this.energyPulse * 0.4})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 10]);
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, 0);
        ctx.lineTo(this.x + this.width/2, this.top);
        ctx.moveTo(this.x + this.width/2, this.canvas.height - this.bottom);
        ctx.lineTo(this.x + this.width/2, this.canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
    }

    drawCrystal(ctx, x, y, size, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Crystal gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, `rgba(102, 204, 255, ${0.8 + this.energyPulse * 0.2})`);
        gradient.addColorStop(0.5, `rgba(153, 102, 255, ${0.6 + this.energyPulse * 0.2})`);
        gradient.addColorStop(1, 'rgba(58, 58, 106, 0.4)');
        
        // Outer glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#66ccff';
        ctx.fillStyle = gradient;
        
        // Draw diamond shape
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.6, 0);
        ctx.lineTo(0, size);
        ctx.lineTo(-size * 0.6, 0);
        ctx.closePath();
        ctx.fill();
        
        // Inner highlight
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + this.energyPulse * 0.3})`;
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.5);
        ctx.lineTo(size * 0.3, 0);
        ctx.lineTo(0, size * 0.5);
        ctx.lineTo(-size * 0.3, 0);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }

    drawEnergyGate(ctx) {
        // Vertical energy beams with flowing particles
        const gradient = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
        gradient.addColorStop(0, 'rgba(153, 102, 255, 0.1)');
        gradient.addColorStop(0.5, `rgba(204, 153, 255, ${0.4 + this.energyPulse * 0.3})`);
        gradient.addColorStop(1, 'rgba(153, 102, 255, 0.1)');
        
        // Main beams
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.fillRect(this.x, this.canvas.height - this.bottom, this.width, this.bottom);
        
        // Flowing particles
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.alpha * (0.5 + this.energyPulse * 0.5);
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#cc99ff';
            ctx.fillStyle = '#cc99ff';
            ctx.beginPath();
            ctx.arc(this.x + p.offsetX, p.offsetY, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        // Pulsing borders
        ctx.shadowBlur = 15 + this.energyPulse * 10;
        ctx.shadowColor = '#9966ff';
        ctx.strokeStyle = `rgba(153, 102, 255, ${0.7 + this.energyPulse * 0.3})`;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, 0, this.width, this.top);
        ctx.strokeRect(this.x, this.canvas.height - this.bottom, this.width, this.bottom);
        ctx.shadowBlur = 0;
    }

    drawPlasmaBeams(ctx) {
        // Multiple thin plasma beams
        const numBeams = 3;
        const beamSpacing = this.width / numBeams;
        
        for (let i = 0; i < numBeams; i++) {
            const beamX = this.x + (i * beamSpacing) + beamSpacing / 2;
            const phase = this.energyPulse + (i * 0.3);
            
            // Top beam
            const topGradient = ctx.createLinearGradient(beamX, 0, beamX, this.top);
            topGradient.addColorStop(0, 'rgba(255, 102, 204, 0.2)');
            topGradient.addColorStop(0.5, `rgba(255, 102, 204, ${0.6 + Math.sin(phase * Math.PI * 2) * 0.4})`);
            topGradient.addColorStop(1, 'rgba(255, 102, 204, 0.8)');
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ff66cc';
            ctx.strokeStyle = topGradient;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(beamX, 0);
            ctx.lineTo(beamX, this.top);
            ctx.stroke();
            
            // Inner glow
            ctx.shadowBlur = 10;
            ctx.strokeStyle = '#ffccee';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(beamX, 0);
            ctx.lineTo(beamX, this.top);
            ctx.stroke();
            
            // Bottom beam
            const bottomGradient = ctx.createLinearGradient(beamX, this.canvas.height - this.bottom, beamX, this.canvas.height);
            bottomGradient.addColorStop(0, 'rgba(255, 102, 204, 0.8)');
            bottomGradient.addColorStop(0.5, `rgba(255, 102, 204, ${0.6 + Math.sin(phase * Math.PI * 2) * 0.4})`);
            bottomGradient.addColorStop(1, 'rgba(255, 102, 204, 0.2)');
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ff66cc';
            ctx.strokeStyle = bottomGradient;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(beamX, this.canvas.height - this.bottom);
            ctx.lineTo(beamX, this.canvas.height);
            ctx.stroke();
            
            // Inner glow
            ctx.shadowBlur = 10;
            ctx.strokeStyle = '#ffccee';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(beamX, this.canvas.height - this.bottom);
            ctx.lineTo(beamX, this.canvas.height);
            ctx.stroke();
        }
        
        ctx.shadowBlur = 0;
    }

    drawHolographicWalls(ctx) {
        // Glitchy holographic appearance with scanlines
        const scanlineCount = 10;
        
        // Top wall
        for (let i = 0; i < scanlineCount; i++) {
            const y = (this.top / scanlineCount) * i;
            const height = this.top / scanlineCount;
            const glitchOffset = Math.sin(this.energyPulse * Math.PI * 2 + i) * 3;
            
            // Alternating cyan and purple
            const hue = i % 2 === 0 ? '#00ffff' : '#ff00ff';
            const alpha = 0.3 + this.energyPulse * 0.3 + (Math.random() * 0.1);
            
            ctx.fillStyle = `${hue}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
            ctx.fillRect(this.x + glitchOffset, y, this.width, height);
            
            // Scanline
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + this.energyPulse * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x, y);
            ctx.lineTo(this.x + this.width, y);
            ctx.stroke();
        }
        
        // Bottom wall
        for (let i = 0; i < scanlineCount; i++) {
            const y = this.canvas.height - this.bottom + (this.bottom / scanlineCount) * i;
            const height = this.bottom / scanlineCount;
            const glitchOffset = Math.sin(-this.energyPulse * Math.PI * 2 - i) * 3;
            
            const hue = i % 2 === 0 ? '#ff00ff' : '#00ffff';
            const alpha = 0.3 + this.energyPulse * 0.3 + (Math.random() * 0.1);
            
            ctx.fillStyle = `${hue}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
            ctx.fillRect(this.x + glitchOffset, y, this.width, height);
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + this.energyPulse * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x, y);
            ctx.lineTo(this.x + this.width, y);
            ctx.stroke();
        }
        
        // Outer glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ffff';
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.5 + this.energyPulse * 0.5})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, 0, this.width, this.top);
        ctx.strokeRect(this.x, this.canvas.height - this.bottom, this.width, this.bottom);
        ctx.shadowBlur = 0;
    }

    drawDestructionEffect(ctx) {
        const segments = 8;
        const segmentHeight = (this.top / segments);
        const bottomSegmentHeight = (this.bottom / segments);
        
        // Draw top pipe segments with spread effect
        for (let i = 0; i < segments; i++) {
            const spread = (this.destructionProgress * 50) * (i / segments);
            const alpha = 1 - this.destructionProgress;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            
            // Add glow to destruction
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#9966ff';
            
            // Top pipe segment
            ctx.fillStyle = '#6a3a7a';
            ctx.fillRect(
                this.x + spread, 
                i * segmentHeight, 
                this.width, 
                segmentHeight
            );
            
            // Bottom pipe segment
            ctx.fillRect(
                this.x - spread,
                this.canvas.height - this.bottom + (i * bottomSegmentHeight),
                this.width,
                bottomSegmentHeight
            );
            
            ctx.restore();
        }
    }

    drawGun(ctx) {
        const centerX = this.x + this.width/2;
        const gunY = this.top;
        
        // Pulsing warning light
        const pulseSize = 8 + this.energyPulse * 4;
        ctx.shadowBlur = 20 + this.energyPulse * 10;
        ctx.shadowColor = '#ff0000';
        ctx.fillStyle = `rgba(255, 0, 0, ${0.8 + this.energyPulse * 0.2})`;
        ctx.beginPath();
        ctx.arc(centerX, gunY - 5, pulseSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Gun barrel with metallic look
        const barrelGradient = ctx.createLinearGradient(centerX - 12, gunY, centerX + 12, gunY);
        barrelGradient.addColorStop(0, '#666666');
        barrelGradient.addColorStop(0.5, '#999999');
        barrelGradient.addColorStop(1, '#666666');
        
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#ff4444';
        ctx.fillStyle = barrelGradient;
        ctx.fillRect(centerX - 12, gunY, 24, 15);
        
        // Energy charge at tip
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff3333';
        ctx.fillStyle = `rgba(255, 51, 51, ${0.7 + this.energyPulse * 0.3})`;
        ctx.beginPath();
        ctx.moveTo(centerX, gunY + 15);
        ctx.lineTo(centerX - 8, gunY + 15);
        ctx.lineTo(centerX, gunY + 25);
        ctx.lineTo(centerX + 8, gunY + 15);
        ctx.closePath();
        ctx.fill();
        
        // Core glow
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ffcccc';
        ctx.beginPath();
        ctx.moveTo(centerX, gunY + 17);
        ctx.lineTo(centerX - 4, gunY + 17);
        ctx.lineTo(centerX, gunY + 22);
        ctx.lineTo(centerX + 4, gunY + 17);
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }

    drawEnemyBullets(ctx) {
        this.enemyBullets.forEach(bullet => {
            // Glow effect
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff3333';
            ctx.fillStyle = '#ff3333';
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Bright center
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ff6666';
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.shadowBlur = 0;
    }

    drawHitCounter(ctx) {
        const hits = this.gameState.getObstacleHits(this.id);
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#66ccff';
        ctx.fillStyle = '#66ccff';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`${hits}/5`, this.x + this.width/2 - 12, 
            this.canvas.height - this.bottom - 10);
        ctx.shadowBlur = 0;
    }

    startDestruction() {
        this.isDestroying = true;
    }

    isFullyDestroyed() {
        return this.destructionProgress >= 1;
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    checkCollision(ship) {
        const bounds = ship.getBounds();
        return (bounds.x + bounds.width > this.x &&
                bounds.x < this.x + this.width &&
                (bounds.y < this.top || 
                 bounds.y + bounds.height > this.canvas.height - this.bottom));
    }

    checkBulletCollision(bullet) {
        return (bullet.x < this.x + this.width &&
                bullet.x + bullet.width > this.x &&
                (bullet.y < this.top || bullet.y > this.canvas.height - this.bottom));
    }

    checkEnemyBulletCollision(ship) {
        const bounds = ship.getBounds();
        for (let bullet of this.enemyBullets) {
            if (bullet.x > bounds.x && 
                bullet.x < bounds.x + bounds.width &&
                bullet.y > bounds.y &&
                bullet.y < bounds.y + bounds.height) {
                return true;
            }
        }
        return false;
    }
}


