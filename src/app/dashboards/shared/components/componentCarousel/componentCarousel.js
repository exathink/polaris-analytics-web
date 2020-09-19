import {useGenerateTicks} from "../../hooks/useGenerateTicks";

export const ComponentCarousel = ({children, tickInterval}) => {

  const tick = useGenerateTicks(children.length, tickInterval);

  return children[tick]

}