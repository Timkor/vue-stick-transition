

var removeChilds = function (node) {
    var last;
    while (last = node.lastChild) node.removeChild(last);
};

function getViewportPosition(element) {
    
    var domRect = element.getBoundingClientRect();

    return {
        x: domRect.left,
        y: domRect.top
    };
}

export default {
    
    template: '<div class="transition"><div ref="source"><slot /></div><div ref="clone" :style="cloneStyle"></div></div></div>',
    
    data() {
        return {
            x: 0,
            y: 0
        };
    },

    computed: {
        cloneStyle() {
            return {
                position: 'fixed',
                left: this.x + 'px',
                top: this.y + 'px'
            }
        }
    },

    mounted() {
        
        var self = this;
        var b = false;
        window.addEventListener('scroll', () => {
            if (!b) {
                self.prepare();
                b=true;
            }
        })
    },

    methods: {

        

        prepare() {

            removeChilds(this.$refs.clone);

            const {x, y} = getViewportPosition(this.$refs.source);

            this.x = x;
            this.y = y;

            Array.from(this.$refs.source.childNodes).forEach((node) => {
                
                this.$refs.clone.appendChild(
                    node//.cloneNode(true)
                )
            })

            
        },

        startTransition() {

        },

        endTransition() {
            
        }
    }
}