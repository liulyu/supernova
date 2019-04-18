    <template>
        <div ref="scroll" >
                <slot>

                </slot>
        </div>
    </template>
    
    <script>
    import  bScroll from 'better-scroll'
    export default {
        props:{
            probeType:{
                type:Number,
                default:1
            },
            click:{
                type:Boolean,
                default:true
            },
            data:{
                type:Array,
                default:null
            },
            refreshDelay: {
                type: Number,
                default: 20
            },
            listenScroll:{
                type:Boolean,
                default:false
            },
            pullUp:{
                type:Boolean,
                default:false
            }
        },
        mounted(){
            this.$nextTick(()=>{
                this._initScroll();
            })
        },
        
        methods:{
            _initScroll(){
                if(!this.$refs.scroll){
                    return 
                }
                this.scroll=new bScroll(this.$refs.scroll,{
                    probeType: this.probeType,
                    click: this.click
                })

                if(this.listenScroll){
                    this.scroll.on("scroll",(pos)=>{
                        this.$emit("scroll",pos)
                    })
                  }
                
                if(this.pullUp){
                    this.scroll.on("scrollEnd",()=>{
                        if(this.scroll.y<=(this.scroll.maxScrollY+50)){
                            this.$emit("scrollEnd")
                        }
                    })
                }
                },

                refresh(){
                    this.scroll && this.scroll.refresh()
                },
                scrollTo() {
                    this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
                },
                scrollToElement(element,time) {
                    this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
                    
                },
                
                
        },

        watch:{
            data() {
                this.$nextTick(()=>{
                    this.refresh();
                })
            }
        }
    }
    </script>
    
<style scoped lang="stylus" rel="stylesheet/stylus">

</style>

    