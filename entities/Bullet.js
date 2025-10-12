class Bullet {
    constructor(ship) {
        this.x = ship.x + ship.width;
        this.y = ship.y + ship.height / 2;
        this.width = 5;
        this.height = 2;
        // Calculate speed as percentage of canvas width for consistent experience across devices
        this.speed = ship.canvas.width * 0.01; // 1% of canvas width ≈ 4px at 400px
        this.canvas = ship.canvas;
    }

    update(deltaMultiplier = 1) {
        this.x += this.speed * deltaMultiplier;
    }

    draw(ctx) {
        // Outer glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#66ccff';
        ctx.fillStyle = '#66ccff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Bright center
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }

    isOffScreen(canvas) {
        return this.x > (canvas || this.canvas).width;
    }
}


