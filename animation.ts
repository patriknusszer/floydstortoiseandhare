class node {
    private chr : string
    private ctx: CanvasRenderingContext2D
    private x: number
    private y: number
    private r : number
    private px : number
    private next : node
    private prev : node
    private prevlst : node
    private lineWidth : number
    private rotation : boolean

    constructor(rotation : boolean, chr: string, ctx : CanvasRenderingContext2D, x: number, y: number, r : number, px : number, lineWidth : number) {
        this.x = x
        this.y = y
        this.ctx = ctx
        this.r = r
        this.px = px
        this.lineWidth = lineWidth
        this.rotation = rotation
        this.drawNode(this.x, this.y, this.r, this.px, chr)
        this.chr = String.fromCharCode(chr.charCodeAt(0))
    }

    public getprevlst() : node { return this.prevlst }
    public getprev() : node { return this.prev }
    public getnext() : node { return this.next }
    public getx() : number { return this.x }
    public gety() : number { return this.y }
    public getr() : number { return this.r }
    public getpx() : number { return this.px }

    private drawNode(x : number, y : number, r : number, px : number, str : string) {
        this.drawCircle(x, y, r)
        this.drawText(x - (7 * (this.r / 22)), y + (7 * (this.r / 22)), px, str);
    }
    
    private static drawLoop(ctx : CanvasRenderingContext2D, epix : number, epiy : number, epir : number, px : number) {
        ctx.beginPath();
        ctx.arc(epix, epiy, epir, 0 * Math.PI, 2 * Math.PI);
        ctx.lineWidth = px;
        ctx.strokeStyle = "#9586bf";
        ctx.stroke();
    }

    private drawLoop(epix : number, epiy : number, epir : number, px : number) {
        this.ctx.beginPath();
        this.ctx.arc(epix, epiy, epir, 0 * Math.PI, 2 * Math.PI);
        this.ctx.lineWidth = px;
        this.ctx.strokeStyle = "#9586bf";
        this.ctx.stroke();
    }
    
    private drawC(r : number, fx : number, fy : number, tx : number, ty : number, px : number) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#9586bf";
        this.ctx.lineWidth = px;

        if (!this.rotation) {
            this.ctx.moveTo(fx + r + this.lineWidth - 2, fy);
            this.ctx.lineTo(tx - r - (this.lineWidth - 2), ty);
        }
        else {
            this.ctx.moveTo(fx, fy + r + this.lineWidth - 2);
            this.ctx.lineTo(tx, ty - r - (this.lineWidth - 2));
        }

        this.ctx.stroke();
    }
    
    private drawCircle(x : number, y : number, r : number) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0 * Math.PI, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fillStyle = "#28283c";
        this.ctx.fill();
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.strokeStyle = "#9586bf";
        this.ctx.stroke();
    }
    
    private drawText(x : number, y : number, px : number, str : string) {
        this.ctx.font = px + "px Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace";
        this.ctx.fillStyle = "#ffc299";
        this.ctx.fillText(str, x, y);
    }

    public drawNext(dx: number, dy: number) : node {
        let tox = this.x + dx
        let toy = this.y + dy
        this.drawC(this.r, this.x, this.y, tox, toy, 3)
        this.next = new node(this.rotation, String.fromCharCode(this.chr.charCodeAt(0) + 1), this.ctx, tox, toy, this.r, this.px, this.lineWidth)
        this.next.prev = this.next.prevlst = this
        return this.next
    }

    public static drawCycle(ctx : CanvasRenderingContext2D, r : number, px : number, lineWidth : number, rotation : boolean, x : number, y: number, nodeNum : number, cycler : number) : Array<node> {
        if (!rotation)
            node.drawLoop(ctx, x + cycler, y, cycler, 3)
        else
            node.drawLoop(ctx, x, y + cycler, cycler, 3)

        var nodes = new Array<node>()
        var chr : string = 'A'
        var n : cnode = new cnode(rotation, chr, ctx, x, y, r, px, lineWidth)
        nodes.push(n)
        let entry = n
        var next : node = entry
        entry.prev = entry.prevlst = null
        let delta = Math.PI * 2 / nodeNum
        var rad = Math.PI - delta

        if (rotation)
            rad -= (Math.PI / 2);

        for (var i : number = 0; i < nodeNum - 1; i++) {
            let dx = Math.cos(rad) * cycler
            let dy = Math.sin(rad) * cycler
            
            if (!rotation)
                nodes.push(n.next = new cnode(rotation, String.fromCharCode(n.chr.charCodeAt(0) + 1), ctx, x + cycler + dx, y - dy, r, px, lineWidth))
            else
                nodes.push(n.next = new cnode(rotation, String.fromCharCode(n.chr.charCodeAt(0) + 1), ctx, x + dx, y + cycler - dy, r, px, lineWidth))

            n.next.prev = n
            n.next.prevlst = n
            n = <cnode> n.next
            rad -= delta;
        }

        n.next = entry
        entry.prev = n
        return nodes
    }

    public drawCycle(dx: number, dy: number, nodeNum: number, cycler : number) : Array<node> {
        let radius = cycler
        let tox = this.x + dx
        let toy = this.y + dy
        this.drawC(this.r, this.x, this.y, tox, toy, 3)

        if (!this.rotation)
            this.drawLoop(tox + radius, toy, radius, 3)
        else
            this.drawLoop(tox, toy + radius, radius, 3)

        var nodes = new Array<node>()
        var n : cnode = new cnode(this.rotation, String.fromCharCode(this.chr.charCodeAt(0) + 1), this.ctx, tox, toy, this.r, this.px, this.lineWidth)
        nodes.push(n)
        let entry = n
        this.next = entry
        entry.prev = entry.prevlst = this
        let delta = Math.PI * 2 / nodeNum
        var rad = Math.PI - delta

        if (this.rotation)
            rad -= (Math.PI / 2);

        for (var i : number = 0; i < nodeNum - 1; i++) {
            let dx = Math.cos(rad) * radius
            let dy = Math.sin(rad) * radius
            
            if (!this.rotation)
                nodes.push(n.next = new cnode(this.rotation, String.fromCharCode(n.chr.charCodeAt(0) + 1), this.ctx, tox + radius + dx, toy - dy, this.r, this.px, this.lineWidth))
            else
                nodes.push(n.next = new cnode(this.rotation, String.fromCharCode(n.chr.charCodeAt(0) + 1), this.ctx, tox + dx, toy + radius - dy, this.r, this.px, this.lineWidth))

            n.next.prev = n
            n.next.prevlst = n
            n = <cnode> n.next
            rad -= delta;
        }

        n.next = entry
        entry.prev = n
        return nodes
    }
}

class cnode extends node {
    private cr : number
    private rad : number

    public set(radius : number, radians : number) {
        this.cr = radius
        this.rad = radians
    }

    public getRadians() : number { return this.rad }
    public getRadius() : number { return this.cr }
}

class creatures {
    private radius : number
    private hx : number
    private hy : number
    private tx : number
    private ty : number
    private width : number
    private height : number
    protected ctx: CanvasRenderingContext2D

    constructor(tx: number, ty: number, hx : number, hy : number, width : number, height : number, ctx: CanvasRenderingContext2D, radius : number) {
        this.radius = radius
        this.tx = tx
        this.ty = ty
        this.hx = hx
        this.hy = hy
        this.ctx = ctx
        this.width = width
        this.height = height
        this.mem = this.ctx.getImageData(0, 0, this.width, this.height)
        this.tplace(this.tx, this.ty)
        this.hplace(this.hx, this.hy)
    }

    private hplace(x: number, y: number) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.radius, 0 * Math.PI, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fillStyle = "#ff96b6";
        this.ctx.fill();
    }

    private tplace(x: number, y: number) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.radius, 0 * Math.PI, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fillStyle = "#29c933";
        this.ctx.fill();
    }

    private remove(x: number, y: number) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.radius + 1, 0 * Math.PI, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fillStyle = "#242434";
        this.ctx.fill();
        this.ctx.putImageData(this.mem, 0, 0)
    }

    private mem : ImageData

    private rmove(turtle : movedat, hare : movedat, time : number, refreshrate: number, elapsed: number, callback: () => void) {
        setTimeout(() => {
            this.remove(this.tx, this.ty)
            this.remove(this.hx, this.hy)

            elapsed += refreshrate
            let steps = time / refreshrate
            let curStep = elapsed / refreshrate
            let tto : pos = turtle.getnextpos(curStep, steps)
            let hto : pos = hare.getnextpos(curStep, steps)

            this.tx = tto.getx()
            this.ty = tto.gety()
            this.hx = hto.getx()
            this.hy = hto.gety()

            this.tplace(this.tx, this.ty)
            this.hplace(this.hx, this.hy)

            if (elapsed <= time)
                this.rmove(turtle, hare, time, refreshrate, elapsed, callback)
            else {
                this.remove(this.tx, this.ty)
                this.remove(this.hx, this.hy)
                this.tplace(this.tx = turtle.gettox(), this.ty = turtle.gettoy())
                this.hplace(this.hx = hare.gettox(), this.hy = hare.gettoy())
                callback()
            }
        }, refreshrate)
    }

    public move(turtle : movedat, hare: movedat, time : number, refreshrate: number, callback: () => void) {
        this.rmove(turtle, hare, time, refreshrate, 0, callback)
    }
}

class pos {
    private x : number
    private y : number

    constructor(x : number, y : number) {
        this.x = x
        this.y = y
    }

    public getx() : number { return this.x }
    public gety() : number { return this.y }
}

abstract class movedat {
    protected origpos : pos
    protected topos : pos

    constructor(x : number, y : number, tox : number, toy : number) {
        this.origpos = new pos(x, y)
        this.topos = new pos(tox, toy)
    }

    public getorigx() { return this.origpos.getx() }
    public getorigy() { return this.origpos.gety() }
    public gettox() { return this.topos.getx() }
    public gettoy() { return this.topos.gety() }
    public abstract getnextpos(step : number, outOfSteps : number) :  pos
}

class linearmovedat extends movedat {
    constructor(x : number, y : number, tox : number, toy : number) {
        super(x, y, tox, toy)
    }

    public getnextpos(step : number, outOfSteps : number) : pos {
        let xdisplace = this.topos.getx() - this.origpos.getx()
        let ydisplace = this.topos.gety() - this.origpos.gety()
        let xdelta = xdisplace / outOfSteps
        let ydelta = ydisplace / outOfSteps
        return new pos(this.origpos.getx() + xdelta * step, this.origpos.gety() + ydelta * step)
    }
}

class arcmovedat extends movedat {
    private epipos : pos
    private radius : number

    constructor(x : number, y : number, tox : number, toy : number, epix : number, epiy : number, radius : number) {
        super(x, y, tox, toy)
        this.epipos = new pos(epix, epiy)
        this.radius = radius
    }

    public getnextposbeta(step: number, outOfSteps: number) : pos {
        let origx = this.epipos.getx() - this.origpos.getx()
        let origy = this.epipos.gety() - this.origpos.gety()

        let destx = this.epipos.getx() - this.topos.getx()
        let desty = this.epipos.gety() - this.topos.gety()

        var origdeg = Math.atan2(origy, origx)

        if (origdeg < 0)
            origdeg += 2 * Math.PI

        var destdeg = Math.atan2(desty, destx)

        if (destdeg < 0)
            destdeg += 2 * Math.PI

        let deltadeg = destdeg - origdeg
        let curdeg = origdeg + deltadeg * step / outOfSteps

        let curx = Math.sin(curdeg) * this.radius
        let cury = Math.cos(curdeg) * this.radius
        return new pos(this.epipos.getx() - curx, this.epipos.gety() - cury)
    }

    public getnextpos(step: number, outOfSteps: number) : pos {
        var origAngle
        var toAngle

        if ((this.origpos.gety() == this.epipos.gety() && this.origpos.getx() > this.epipos.getx()) || this.origpos.gety() > this.epipos.gety())
            origAngle = Math.acos((this.origpos.getx() - this.epipos.getx()) / this.radius) + Math.PI
        else
            origAngle = Math.acos((this.epipos.getx() - this.origpos.getx()) / this.radius)
        
        if ((this.topos.gety() == this.epipos.gety() && this.topos.getx() > this.epipos.getx()) || this.topos.gety() > this.epipos.gety())
            toAngle = Math.acos((this.topos.getx() - this.epipos.getx()) / this.radius) + Math.PI
        else
            toAngle = Math.acos((this.epipos.getx() - this.topos.getx()) / this.radius)

        if (toAngle < origAngle)
            toAngle += Math.PI * 2
        
        let angleDisplace = toAngle - origAngle
        let angleDelta = angleDisplace / outOfSteps
        let curAngle = origAngle + (angleDelta * step)
        let rely = Math.sin(curAngle) * this.radius
        let relx = Math.cos(curAngle) * this.radius
        return new pos(this.epipos.getx() - relx, this.epipos.gety() - rely)
    }
}

class Animator {
    private ctx : CanvasRenderingContext2D
    private snapshot : ImageData
    private width : number
    private height : number
    private tail : number
    private cycle : number
    private noder : number
    private cycler : number
    private nodepx : number
    private nodedist : number
    private cyclepos : pos
    private initx : number
    private inity : number
    private time : number
    private refresh : number
    private creaturesr : number
    private nodeborder : number
    private rotation : boolean
    private terminateFlag : Boolean = false
    private terminateCallback : () => void

    constructor(rotation : boolean, time, refresh, initx : number, inity : number, ctx: CanvasRenderingContext2D, width: number, height: number, tail : number, cycle : number, noder : number, nodedist : number, nodepx: number, nodeborder : number, cycler : number, creaturesr : number) {
        this.width = width
        this.height = height
        this.tail = tail
        this.cycle = cycle
        this.noder = noder
        this.cycler = cycler
        this.nodepx = nodepx
        this.nodedist = nodedist
        this.ctx = ctx
        this.initx = initx
        this.inity = inity
        this.time = time
        this.refresh = refresh
        this.creaturesr = creaturesr
        this.nodeborder = nodeborder
        this.rotation = rotation
        let list = this.drawList()

        if (!this.terminateFlag) {
            this.snapshot = this.ctx.getImageData(0, 0, this.width, this.height)

            setTimeout(() => {
                this.makeMeet1(list)
            }, 800)
        }
        else
            this.terminateCallback()
    }

    public terminate(callback : () => void) {
        this.terminateCallback = callback
        this.terminateFlag = true
    }

    private drawList() : Array<node> {
        let nodes = Array<node>()

        if (this.tail == 0) {
            if (!this.rotation)
                this.cyclepos = new pos(this.initx + this.cycler, this.inity)
            else
                this.cyclepos = new pos(this.initx, this.inity + this.cycler)
            
            return node.drawCycle(this.ctx, this.noder, this.nodepx, this.nodeborder, this.rotation, this.initx, this.inity, this.cycle, this.cycler)
        }
        else {
            var n
    
            for (var i = 0; i < this.tail; i++) {
                if (!n) {
                    n = new node(this.rotation, 'A', this.ctx, this.initx, this.inity, this.noder, this.nodepx, this.nodeborder)
                    nodes.push(n)
                }
                else if (!this.rotation)
                    nodes.push(n = n.drawNext(this.nodedist, 0))
                else
                    nodes.push(n = n.drawNext(0, this.nodedist))
            }
    
            if (!this.rotation)
                this.cyclepos = new pos(nodes[nodes.length - 1].getx() + this.nodedist + this.cycler, nodes[nodes.length - 1].gety())
            else
                this.cyclepos = new pos(nodes[nodes.length - 1].getx(), nodes[nodes.length - 1].gety() + this.nodedist + this.cycler)
    
            if (!this.rotation)
                nodes = nodes.concat(nodes[nodes.length - 1].drawCycle(this.nodedist, 0, this.cycle, this.cycler))
            else
                nodes = nodes.concat(nodes[nodes.length - 1].drawCycle(0, this.nodedist, this.cycle, this.cycler))
    
            return nodes
        }
    }

    private makeMeet1(list: Array<node>) {
        var tindex = 1, hindex = 2
        var prevt : node = list[0]
        var prevh : node = list[0]
        var t : node = list[tindex]
        var h : node = list[hindex]
        let crs = new creatures(prevt.getx(), prevt.gety(), prevt.getx(), prevt.gety(), this.width, this.height, this.ctx, this.creaturesr)

        let callback = () => {
            if (!this.terminateFlag) {
                if (t != h) {
                    prevt = t
                    prevh = h
                    t = t.getnext()
                    h = h.getnext().getnext()
    
                    setTimeout(() => {
                        let tmover : movedat
                        let hmover : movedat
    
                        if (!(prevh instanceof cnode) && h instanceof cnode && prevh.getnext() instanceof cnode) {
                            tmover = new linearmovedat(prevt.getx(), prevt.gety(), prevt.getx() + ((t.getx() - prevt.getx()) / 2), prevt.gety() + ((t.gety() - prevt.gety()) / 2))
                            hmover = new linearmovedat(prevh.getx(), prevh.gety(), prevh.getnext().getx(), prevh.getnext().gety())
    
                            crs.move(tmover, hmover, this.time / 2, this.refresh, () => {
                                tmover = new linearmovedat(prevt.getx() + ((t.getx() - prevt.getx()) / 2), prevt.gety() + ((t.gety() - prevt.gety()) / 2), t.getx(), t.gety())
                                hmover = new arcmovedat(prevh.getnext().getx(), prevh.getnext().gety(), h.getx(), h.gety(), this.cyclepos.getx(), this.cyclepos.gety(), this.cycler)
                                crs.move(tmover, hmover, this.time / 2, this.refresh, callback)
                            })
                        }
                        else {
                            if (prevt instanceof cnode && t instanceof cnode)
                                tmover = new arcmovedat(prevt.getx(), prevt.gety(), t.getx(), t.gety(), this.cyclepos.getx(), this.cyclepos.gety(), this.cycler)
                            else
                                tmover = new linearmovedat(prevt.getx(), prevt.gety(), t.getx(), t.gety())
    
                            if (prevh instanceof cnode && h instanceof cnode)
                                hmover = new arcmovedat(prevh.getx(), prevh.gety(), h.getx(), h.gety(), this.cyclepos.getx(), this.cyclepos.gety(), this.cycler)
                            else
                                hmover = new linearmovedat(prevh.getx(), prevh.gety(), h.getx(), h.gety())
                            
                            crs.move(tmover, hmover, this.time, this.refresh, callback)
                        }
                    }, 120)
                }
                else
                    setTimeout(() => this.makeMeet2(list, t), 500)
            }
            else
                this.terminateCallback()
        }

        let tmover : movedat
        let hmover : movedat

        if (!(prevh instanceof cnode) && h instanceof cnode && prevh.getnext() instanceof cnode) {
            tmover = new linearmovedat(prevt.getx(), prevt.gety(), prevt.getx() + ((t.getx() - prevt.getx()) / 2), prevt.gety() + ((t.gety() - prevt.gety()) / 2))
            hmover = new linearmovedat(prevh.getx(), prevh.gety(), prevh.getnext().getx(), prevh.getnext().gety())

            crs.move(tmover, hmover, this.time / 2, this.refresh, () => {
                tmover = new linearmovedat(prevt.getx() + ((t.getx() - prevt.getx()) / 2), prevt.gety() + ((t.gety() - prevt.gety()) / 2), t.getx(), t.gety())
                hmover = new arcmovedat(prevh.getnext().getx(), prevh.getnext().gety(), h.getx(), h.gety(), this.cyclepos.getx(), this.cyclepos.gety(), this.cycler)
                crs.move(tmover, hmover, this.time / 2, this.refresh, callback)
            })
        }
        else {
            if (prevt instanceof cnode && t instanceof cnode)
                tmover = new arcmovedat(prevt.getx(), prevt.gety(), t.getx(), t.gety(), this.cyclepos.getx(), this.cyclepos.gety(), this.cycler)
            else
                tmover = new linearmovedat(prevt.getx(), prevt.gety(), t.getx(), t.gety())

            if (prevh instanceof cnode && h instanceof cnode)
                hmover = new arcmovedat(prevh.getx(), prevh.gety(), h.getx(), h.gety(), this.cyclepos.getx(), this.cyclepos.gety(), this.cycler)
            else
                hmover = new linearmovedat(prevh.getx(), prevh.gety(), h.getx(), h.gety())

            crs.move(tmover, hmover, this.time, this.refresh, callback)
        }
    }

    private makeMeet2(list: Array<node>, t: node) {
        this.ctx.putImageData(this.snapshot, 0, 0)
        var prevt : node = t
        var prevh : node = list[0]
        var h : node = list[1]
        var t : node = t.getnext()
        let crs = new creatures(t.getprev().getx(), t.getprev().gety(), h.getprev().getx(), h.getprev().gety(), this.width, this.height, this.ctx, this.creaturesr)

        if (this.tail == 0) {
            setTimeout(() => {
                this.ctx.putImageData(this.snapshot, 0, 0)
                this.makeMeet1(list) 
            }, 100)
        }
        else {
            let callback = () => {
                if (!this.terminateFlag) {
                    if (t != h) {
                        prevt = t
                        prevh = h
                        t = t.getnext()
                        h = h.getnext()
        
                        setTimeout(() => {
                            let tmover : movedat
                            let hmover : movedat
        
                            if (prevt instanceof cnode && t instanceof cnode)
                                tmover = new arcmovedat(prevt.getx(), prevt.gety(), t.getx(), t.gety(), this.cyclepos.getx(), this.cyclepos.gety(), this.cycler)
                            else
                                tmover = new linearmovedat(prevt.getx(), prevt.gety(), t.getx(), t.gety())
        
                            if (prevh instanceof cnode && h instanceof cnode)
                                hmover = new arcmovedat(prevh.getx(), prevh.gety(), h.getx(), h.gety(), this.cyclepos.getx(), this.cyclepos.gety(), this.cycler)
                            else
                                hmover = new linearmovedat(prevh.getx(), prevh.gety(), h.getx(), h.gety())
        
                            crs.move(tmover, hmover, this.time, this.refresh, callback)
                        }, 120)
                    }
                    else {
                        setTimeout(() => {
                            this.ctx.putImageData(this.snapshot, 0, 0)
                            this.makeMeet1(list) 
                        }, 100)
                    }
                }
                else
                    this.terminateCallback()
            }
    
            let tmover : movedat
            let hmover : movedat
    
            if (prevt instanceof cnode && t instanceof cnode)
                tmover = new arcmovedat(prevt.getx(), prevt.gety(), t.getx(), t.gety(), this.cyclepos.getx(), this.cyclepos.gety(), this.cycler)
            else
                tmover = new linearmovedat(prevt.getx(), prevt.gety(), t.getx(), t.gety())
    
            if (prevh instanceof cnode && h instanceof cnode)
                hmover = new arcmovedat(prevh.getx(), prevh.gety(), h.getx(), h.gety(), this.cyclepos.getx(), this.cyclepos.gety(), this.cycler)
            else
                hmover = new linearmovedat(prevh.getx(), prevh.gety(), h.getx(), h.gety())
    
            crs.move(tmover, hmover, this.time, this.refresh, callback)
        }
    }
}

function isNormalInteger(str : String) : Boolean {
    var n = Math.floor(Number(str))
    return n !== Infinity && String(n) === str && n >= 0
}

function isBoolean(str : String) : Boolean {
    return str == 'true' || str == 'false'  || str == 'True' || str == 'False'
}

let width : number =  document.documentElement.clientWidth
let height : number = 750
var animator

var PIXEL_RATIO = window.devicePixelRatio

function algo(ctx : CanvasRenderingContext2D) {
    let floyd = <HTMLCanvasElement>document.getElementById("floyd")
    floyd.width = (width * PIXEL_RATIO)
    floyd.height = (height * PIXEL_RATIO)
    ctx.scale(PIXEL_RATIO, PIXEL_RATIO)
    var cycler = 100;
    var initx = 150;
    var inity = 260;
    var time = 50;
    var refresh = 1;
    var nodedist = 25;
    var noder = 10;
    var nodepx = 12;
    var cycle = 6;
    var tail = 15;
    var creaturesr = 6;
    var nodeborder = 2;
    let vertical = (document.documentElement.clientWidth / document.documentElement.clientHeight) < 1

    if (!vertical && width >= 1400) {
        nodeborder = 4
        noder = 22
        nodedist = 70
        nodepx = 18
        initx = 150
        creaturesr = 10
        tail = 10
    }

    if (vertical) {
        initx = 200
        inity = 50
    }

    var input : HTMLInputElement

    if ((input = <HTMLInputElement>document.getElementById("tail")).value && input.value.length > 0 && isNormalInteger(input.value))
        tail = Number(input.value)
    if ((input = <HTMLInputElement>document.getElementById("cycle")).value && input.value.length > 0 && isNormalInteger(input.value))
        cycle = Number(input.value)
    if ((input = <HTMLInputElement>document.getElementById("move")).value && input.value.length > 0 && isNormalInteger(input.value))
        time = Number(input.value)
    /* if ((input = <HTMLInputElement>document.getElementById("horisontal")).value && isBoolean(input.value))
        vertical = !(input.value == 'true' || input.value == 'True')
    if ((input = <HTMLInputElement>document.getElementById("refreshrate")).value && input.value.length > 0 && isNormalInteger(input.value))
        refresh = Number(input.value)
    if ((input = <HTMLInputElement>document.getElementById("noder")).value && input.value.length > 0 && isNormalInteger(input.value))
        noder = Number(input.value)
    if ((input = <HTMLInputElement>document.getElementById("cycler")).value && input.value.length > 0 && isNormalInteger(input.value))
        cycler = Number(input.value)
    if ((input = <HTMLInputElement>document.getElementById("nodedist")).value && input.value.length > 0 && isNormalInteger(input.value))
        nodedist = Number(input.value)
    if ((input = <HTMLInputElement>document.getElementById("nodeborder")).value && input.value.length > 0 && isNormalInteger(input.value))
        nodeborder = Number(input.value)
    if ((input = <HTMLInputElement>document.getElementById("nodepx")).value && input.value.length > 0 && isNormalInteger(input.value))
        nodepx = Number(input.value)
    if ((input = <HTMLInputElement>document.getElementById("initx")).value && input.value.length > 0 && isNormalInteger(input.value))
        initx = Number(input.value)
    if ((input = <HTMLInputElement>document.getElementById("inity")).value && input.value.length > 0 && isNormalInteger(input.value))
        inity = Number(input.value) */

    if (cycle > 10)
        cycler *= (cycle / 20)

    animator = new Animator(vertical, time, refresh, initx, inity, ctx, width * PIXEL_RATIO, height * PIXEL_RATIO, tail, cycle, noder, nodedist, nodepx, nodeborder, cycler, creaturesr)
}

function init() {
    let cb = () => {
        let floyd = <HTMLCanvasElement> document.getElementById('floyd')
        let ctx = floyd.getContext("2d")
        ctx.clearRect(0, 0, width, height);
        algo(ctx);
    }

    if (animator)
        animator.terminate(cb)
    else
        cb()
}