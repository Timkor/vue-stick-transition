const State = {
    ENTER: 'enter',
    ENTER_TO: 'enter-to',
    LEAVE: 'leave',
    LEAVE_TO: 'leave-to'
};

const OverarchingState = {};
OverarchingState[State.ENTER] = 'enter-active';
OverarchingState[State.ENTER_TO] = 'enter-active';
OverarchingState[State.LEAVE] = 'leave-active';
OverarchingState[State.LEAVE_TO] = 'leave-active';



var removeChilds = function (node) {
    var last;
    while (last = node.lastChild) node.removeChild(last);
};

function getViewportPosition(element) {
    
    var domRect = element.getBoundingClientRect();

    return {
        x: domRect.left,
        y: domRect.top,
        width: domRect.width,
        height: domRect.height,
        centerX: domRect.left + (domRect.width / 2),
        centerY: domRect.top + (domRect.height / 2)
    };
}

function nextFrame(callback) {
    window.requestAnimationFrame(callback);
}

export default {
    
    template: `<div class="transition" :class="classes"><div ref="source" class="source"><slot /></div><div ref="clone" class="clone" :style="cloneStyle"></div></div></div>`,
    
    props: {
        name: {
            type: String,
            default: 'v'
        },

        duration: {
            type: Number,
            default: 500
        },

        transitionDuration: {
            type: Number,
            default: null
        },

        easing: {
            type: String,
            default: 'linear'
        },

        scale: {
            type: Boolean,
            default: false
        },

        prepare: Boolean
    },

    data() {
        return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            centerX: 0,
            centerY: 0,
            translateX: 0,
            translateY: 0,
            scaleX: 1,
            scaleY: 1,
            state: null
        };
    },

    computed: {
        
        classes() {
            if (this.state == null) {
                return null;
            }

            return [
                this.name + '-' + this.state,
                this.name + '-' + OverarchingState[this.state]
            ];
        },

        cloneStyle() {
            
            var duration = this.state === State.ENTER ? 0 : this.transitionDuration ? this.transitionDuration : this.duration;
            var transition = `transform ${duration}ms ease`;

            return {
                position: 'fixed',
                left: this.x + 'px',
                top: this.y + 'px',
                transform: `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scaleX}, ${this.scaleY})`,
                transition: transition,
                zIndex: 999999
            }
        }
    },

    mounted() {
        

        if (this.prepare) {
            this.prepareEnter();
        }
    },

    methods: {

        

        prepareEnter() {

            this.$emit('before-enter');

            if (this.state === State.ENTER) {
                return;
            }

            removeChilds(this.$refs.clone);

            const {x, y, width, height, centerX, centerY} = getViewportPosition(this.$refs.source);

            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.centerX = centerX;
            this.centerY = centerY;
            
            Array.from(this.$refs.source.childNodes).forEach((node) => {
                
                this.$refs.clone.appendChild(
                    node.cloneNode(true)
                )
            })

            this.state = State.ENTER;
        },

        doEnter(targetElement) {
            
            this.prepareEnter();

            const {centerX, centerY, width, height} = getViewportPosition(targetElement);

            if (this.scale) {
                this.scaleX = width / this.width;
                this.scaleY = height / this.height;
            }
            
            this.$emit('enter');

            nextFrame(() => {
                this.state = State.ENTER_TO;

                if (!this.scale) {
                    this.scaleX = width / this.width;
                    this.scaleY = height / this.height;
                }
                this.translateX = (centerX - this.centerX);
                this.translateY = (centerY - this.centerY);

                this.$emit('after-enter');
            });
            
            setTimeout(() => {
                
                this.doLeave();

            }, this.duration);
        },
        
        prepareLeave() {

            if (this.state === State.LEAVE) {
                return;
            }

            this.$emit('before-leave');

            this.state = State.LEAVE;
        },

        doLeave() {
           
            this.prepareLeave();

            this.$emit('leave');

            nextFrame(() => {
                this.state = State.LEAVE_TO;

                this.$emit('after-leave');
            });
        },

        reset() {

            this.translateX = 0;
            this.translateY = 0;
            this.scaleX = 1;
            this.scaleY = 1;

            nextFrame(() => {
                if (this.prepare) {
                    this.prepareEnter();
                }
            });
        }
    }
}