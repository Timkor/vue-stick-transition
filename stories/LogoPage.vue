<template>
    <div>
        <div id=menu>
            <Logo ref="target"></Logo>
        </div>
        <div id=intro @click="run">
            <div>
                <stick-transition ref="stickTransition">
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
    
    export default {
        components: {
            Logo
        },

        methods: {
            getTarget() {
                return this.$refs.target;
            },

            run() {
                var t = this.$refs.stickTransition;

                t.prepare();
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

    #content {
        height: 100vh;
    }
</style>