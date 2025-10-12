class Ship {
    constructor(x, y, shipImage, canvas) {
        this.shipImage = shipImage;
        this.canvas = canvas;
        
        // Size as percentage of canvas
        this.widthPercent = 0.125; // 12.5% of canvas width (≈50px at 400px)
        this.heightPercent = 0.05; // 5% of canvas height (≈30px at 600px)
        
        // Position as percentage
        this.xPercent = 0.125; // 12.5% from left (≈50px at 400px)
        this.yPercent = 0.25; // 25% from top (≈150px at 600px)
        
        this.updateDimensions();
        
        // Calculate speeds as percentage of canvas height for consistent experience
        this.lift = -this.canvas.height * 0.0067;
        this.downForce = this.canvas.height * 0.0067;
        this.velocityIncrement = this.canvas.height * 0.0002;
        this.velocity = this.canvas.height * 0.000167;
        this.gravity = 0;
    }
    
    updateDimensions() {
        this.width = this.canvas.width * this.widthPercent;
        this.height = this.canvas.height * this.heightPercent;
        this.x = this.canvas.width * this.xPercent;
        this.y = this.canvas.height * this.yPercent;
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
        
        // Add subtle ambient glow around the ship
        ctx.globalAlpha = 0.3;
        const ambientGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width * 0.8);
        ambientGlow.addColorStop(0, 'rgba(102, 204, 255, 0.4)');
        ambientGlow.addColorStop(0.6, 'rgba(153, 102, 255, 0.2)');
        ambientGlow.addColorStop(1, 'rgba(102, 102, 204, 0)');
        ctx.fillStyle = ambientGlow;
        ctx.beginPath();
        ctx.arc(0, 0, this.width * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Draw the ship image
        ctx.drawImage(
            this.shipImage, 
            -this.width/2, // Center the image
            -this.height/2,
            this.width,
            this.height
        );
        
        // Add engine glow effect with cyan/purple
        const engineGlow = ctx.createRadialGradient(
            -this.width/2, 0, 0,
            -this.width/2, 0, this.width/2
        );
        engineGlow.addColorStop(0, 'rgba(102, 204, 255, 0.9)');
        engineGlow.addColorStop(0.5, 'rgba(153, 102, 255, 0.6)');
        engineGlow.addColorStop(1, 'rgba(102, 102, 204, 0)');
        
        ctx.fillStyle = engineGlow;
        ctx.fillRect(-this.width/2 - 20, -this.height/2, 20, this.height);
        
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
        this.updateDimensions();
        this.y = this.canvas.height * this.yPercent;
        this.x = this.canvas.width * this.xPercent;
        this.velocity = this.canvas.height * 0.000167;
        this.lift = -this.canvas.height * 0.0067;
        this.downForce = this.canvas.height * 0.0067;
        this.velocityIncrement = this.canvas.height * 0.0002;
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


