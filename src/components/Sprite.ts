import {
    defineComponent,
    Types
} from 'bitecs'

export const Sprite = defineComponent({
    texture: Types.ui8,
    width: Types.i32
});
export default Sprite;