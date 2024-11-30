export default function Csvs({ title = "", text = "", setText = () => {} }) {
  return (
    <fieldset className="names">
      <legend>{title}</legend>
      <div className="name-div">
        <textarea
          type="text"
          className="text-inp"
          placeholder={"comma seperated " + title + " names"}
          required
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>
    </fieldset>
  );
}
