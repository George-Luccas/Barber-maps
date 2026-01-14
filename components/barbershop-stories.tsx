import { getBarbershopsWithStories } from "@/data/barbershops";
import StoryList from "./story-list";

const BarbershopStories = async () => {
  const barbershops = await getBarbershopsWithStories();

  return (
    <StoryList barbershops={barbershops} />
  );
};

export default BarbershopStories;
