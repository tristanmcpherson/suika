import { Types, defineComponent } from 'bitecs'
import Vector2 from '../types/Vector2';

export const Position = defineComponent({...Vector2, ignoreGravity: Types.i8 })
export default Position;