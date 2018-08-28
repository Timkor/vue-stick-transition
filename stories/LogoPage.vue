<template>
    <div :class="{scrolling: isScrolling}">
        <div id=menu>
            <Logo ref="target"></Logo>
            <nav>
                <a href="#">
                    Home
                </a>
                <a href="#">
                    About
                </a>
                <a href="#">
                    Contact
                </a>
            </nav>
        </div>
        <div id=intro>
            <div class="content">
                <stick-transition @after-leave="afterLeave" prepare scale :duration="800" :transition-duration="500" easing="ease" name="move" ref="stickTransition">
                    <Logo ></Logo>
                </stick-transition>
                <div class="text align-self-center">
                    <div class="slogan">Scroll down </div>
                    <div class="subslogan">To see the transition</div>
                    <!--<div style="padding: 20px 0">
                      <b-button variant="success" size="lg">Learn more</b-button>
                    </div>-->
                </div>
            </div>
            <div>
                
            </div>
        </div>
        <div id=main>

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

                    this.$refs.stickTransition.reset();
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
<style lang="less">
    body {
        margin: 0;
        font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    #menu {
        position: fixed;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-content: center;
        padding: 10px;

        nav {
            transition: margin-left .6s ease;
            margin-left: -40px;
        }

        nav > a {
            line-height: 40px;
            height: 40px;
            margin: 0 10px;
            text-decoration: none;
            color: dodgerblue;
        }
    }

    #menu .logo {
        width: 40px;
        height: 40px;
        opacity: 0;
    }

    .scrolling #menu {
        transition: background-color .4s ease;
        background-color: white;

        nav {
            margin-left: 0;
            transition: margin-left .6s .2s ease-out;
        }
    }
    .scrolling .logo {
        opacity: 1;
        transition: opacity 0 .8s;
        
    }

    .scrolling .source .logo {
        opacity: 0;
    }
    
    #intro {
        height: 80vh;
        background: #f0f0f0;
        
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .content {
            
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: left;

            .text {
                
                overflow: hidden;
                white-space: nowrap;
                padding-left: 2rem;
                
                display: block;

                font-size: 2rem;
                color: #526488;

                letter-spacing: 1px;

                .slogan {
                    color: #35495e;

                    font-size: 3rem;
                    
                }

                .subslogan {
                    
                }
            }
        }
    }

    #intro .logo {
        width: 200px;
        height: 200px;
    }

    #main {
        height: 100vh;
    }

    .move-enter .source {
        opacity: 1;
        transition: opacity 0s .8s ease;
    }

    .move-enter-to .source {
        opacity: 0;
    }

    .move-enter-to .clone .logo {
        animation: lift .8s;
    }

    .move-leave-to .source {
        transition: none;
        opacity: 0;
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