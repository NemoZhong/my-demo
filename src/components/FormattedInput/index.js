import {Input,InputNumber} from 'element-ui'

export function WithFormatter(InnerComponent){
    return {
        components:{
            InnerComponent,Input
        },
        props:{
            ...InnerComponent.props,
            formatter: {
                type:Function,
                default(value){
                    return value
                }
            },
            inputStyle:{
                type:Object,
                default(){}
            },
            displayStyle:{
                type:Object,
                default(){}
            }
        },
        computed: {
            computedValue(){
                if(this.focus){
                    return this.value
                }else{
                    return this.formatter(this.value)
                }
            }
        },
        data(){
            return {
                focus:false
            }
        },
        methods: {
            onBlur(...e){
                this.focus=false
                this.$emit('blur',e)
            },
            onFocus(...e){
                this.focus=true
                this.$emit('focus',e)
                this.$nextTick(()=>{
                    this.$refs.input.focus()
                })
            }
        },
        render(h) {
            return h('div',{
                style:{
                    display:'inline-block'
                }
            },[
                h(InnerComponent,{
                    on:{
                        ...this.$listeners,
                        blur:this.onBlur,
                        focus:this.onFocus
                    },
                    props:{
                        ...this.$props,
                        value:this.value
                    },
                    style:{
                        ...this.$props.inputStyle,
                        ...(!this.focus && {display:'none'})
                    },
                    scopedSlots:this.$scopedSlots,
                    attrs:this.$attrs,
                    ref:'input'
                },this.$slots),
                h(Input,{
                    on:{
                        ...this.$listeners,
                        blur:this.onBlur,
                        focus:this.onFocus
                    },
                    props:{
                        ...this.$props,
                        value:this.computedValue
                    },
                    style:{
                        ...this.$props.inputStyle,
                        ...(this.focus && {display:'none'})
                    },
                    scopedSlots:this.$scopedSlots,
                    attrs:this.$attrs
                },this.$slots)
            ])
        },
    }

}

export const FormattedInput=WithFormatter(Input)
export const FormattedInputNumber=WithFormatter(InputNumber)