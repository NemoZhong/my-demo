import {Input} from 'element-ui'

function secondPackInput(InnerComponent){
    return {
        props:{...InnerComponent.props},
        render(h){
            return h('div',{
                class:'input-container'
            },[h(InnerComponent,{
                on:this.$listeners,
                props:{
                    ...this.props
                },
                scopedSlots:this.$scopeSlots,
                attrs:this.$attrs,
                class:'input-line width-100',
                value:this.value
            })],this.$slots)
        }
    }
}

export const InputLine =secondPackInput(Input)
