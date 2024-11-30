import img0 from "../assets/0.png";
import img1 from "../assets/1.png";
import img2 from "../assets/2.png";

export default function NoPAT() {
  return (
    <section className="nopat">
      Add PAT Token
      <hr />
      Permissions Needed
      <div className="imgs">
        <img src={img0} alt="0" />
        <img src={img1} alt="1" />
        <img src={img2} alt="2" />
      </div>
    </section>
  );
}
