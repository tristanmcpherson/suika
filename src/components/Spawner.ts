import { Types, defineComponent } from "bitecs";

export const Spawner = defineComponent({
    fruit: Types.i32,
    type: Types.i32,
    spawned: Types.eid
})
export default Spawner;