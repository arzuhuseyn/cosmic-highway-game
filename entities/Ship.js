class Ship {
    constructor(x, y, shipImage, canvas) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 30;
        this.gravity = 0;
        this.shipImage = shipImage;
        this.canvas = canvas;
        
        // Calculate speeds as percentage of canvas height for consistent experience across devices
        this.lift = -canvas.height * 0.0067; // 0.67% of canvas height (upward) ≈ 4px at 600px
        this.downForce = canvas.height * 0.0067; // 0.67% of canvas height (downward) ≈ 4px at 600px
        this.velocityIncrement = canvas.height * 0.0002; // 0.02% of canvas height ≈ 0.12px at 600px
        this.velocity = canvas.height * 0.000167; // 0.0167% of canvas height ≈ 0.1px at 600px
    }

    update(deltaMultiplier = 1) {
        this.velocity += this.velocityIncrement * deltaMultiplier;
        this.y += this.velocity * deltaMultiplier;
    }

    draw(ctx) {
        ctx.save();
        // Center the rotation around the ship's center
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        
        // Add slight tilt based on velocity
        const tilt = Math.min(Math.max(this.velocity * 4, -30), 30);
        ctx.rotate(tilt * Math.PI / 280);
        
        // Draw the ship image
        ctx.drawImage(
            this.shipImage, 
            -this.width/2, // Center the image
            -this.height/2,
            this.width,
            this.height
        );
        
        // Add engine glow effect with cyan/purple
        const glow = ctx.createRadialGradient(
            -this.width/2, 0, 0,
            -this.width/2, 0, this.width/2
        );
        glow.addColorStop(0, 'rgba(102, 204, 255, 0.9)');
        glow.addColorStop(0.5, 'rgba(153, 102, 255, 0.6)');
        glow.addColorStop(1, 'rgba(102, 102, 204, 0)');
        
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#66ccff';
        ctx.fillStyle = glow;
        ctx.fillRect(-this.width/2 - 20, -this.height/2, 20, this.height);
        ctx.shadowBlur = 0;
        
        ctx.restore();
    }

    applyLift() {
        this.velocity = this.lift;
    }

    applyDownForce() {
        this.velocity = this.downForce;
    }

    isOutOfBounds() {
        return this.y + this.height > this.canvas.height || this.y < 0;
    }

    reset() {
        this.y = 150;
        this.velocity = this.canvas.height * 0.000167; // Reset to initial velocity
        this.x = 50;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}


