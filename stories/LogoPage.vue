<template>
    <div>
        <div id=menu>
            <Logo ref="target"></Logo>
        </div>
        <div id=intro @click="startTransition()">
            <div>
                <stick-transition @after-leave="afterLeave" prepare scale :duration="800" :transition-duration="500" easing="ease" name="move" ref="stickTransition">
                    <Logo ></Logo>
                </stick-transition>
            </div>
        </div>
        <div id=content>

        </div>
    </div>
</template>
<script>
    
    import Logo from './Logo.vue';
  
    var isScrollingNext = () => typeof window == 'undefined' ? false : window.scrollY > 0;

    export default {
        components: {
            Logo
        },

        data() {
            return {
                isScrolling: isScrollingNext()
            };
        },

        mounted() {
            this.eventListener = () => {
                if (!this.isScrolling && isScrollingNext()) {
                    this.isScrolling = true;

                    this.startTransition();
                }

                if (this.isScrolling && !isScrollingNext()) {
                    this.isScrolling = false;
                }
            };

            window.addEventListener('scroll', this.eventListener);
        },

        beforeDestroy() {
            window.removeEventListener('scroll', this.eventListener);
        },

        methods: {
            getTarget() {
                return this.$refs.target;
            },

            startTransition() {
                this.$refs.stickTransition.doEnter(
                    this.$refs.target.$el
                );
            },

            afterLeave() {
                
                //this.isScrolling = false;
            }
        }
    }

</script>
<style lang="css">
    body {
        margin: 0;
    }

    #menu {
        position: fixed;
    }

    #menu .logo {
        width: 40px;
        height: 40px;
    }
    
    #intro {
        height: 80vh;
        background: #f0f0f0;
        
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    #intro .logo {
        width: 200px;
        height: 200px;
    }

    #content {
        height: 100vh;
    }

    .move-enter-to .source {
        opacity: 0;
    }

    .move-enter-to .clone .logo {
        animation: lift .8s;

    }

    @keyframes lift {

        0% { transform: scale(1); opacity: 1 }
        20% { transform: scale(2); opacity: .7; }
        50% { transform: scale(2.5); opacity: .7; }
        80% { transform: scale(2); opacity: .7; }
        90% { transform: scale(0.75); opacity: 1 }
        100% { transform: scale(1) }
    }
</style>