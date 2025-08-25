import { ComponentSlotImage } from "@/pages/Dashboard/component/ryu";

const CardImageOverlay = ({ image, title, description }) => {
  return (
    <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden">
      {image ? <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      /> : <ComponentSlotImage containerClassName="w-full h-full object-cover rounded-md" />}
      <div className="absolute inset-x-0 bottom-0 p-4 h-fit bg-gradient-to-t from-black/75 to-transparent">
        <div className="space-y-1.5">
          <h3 className="text-white text-2xl font-bold">{title}</h3>
          <p className="text-white text-sm line-clamp-2">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default CardImageOverlay;
