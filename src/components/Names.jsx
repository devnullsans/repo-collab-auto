export default function Names({ title = "", names = [], setNames = () => {} }) {
  return (
    <fieldset className="names">
      <legend>{title}</legend>
      {names.map((name, index) => (
        <div
          key={index}
          className="name-div">
          <input
            type="text"
            className="name-inp"
            placeholder={title + " name"}
            required
            value={name}
            onChange={(e) => setNames((n) => n.toSpliced(index, 1, e.target.value))}
          />
          <button
            type="button"
            onClick={() => setNames((n) => n.toSpliced(index, 1))}>
            Del
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setNames((n) => n.concat(""))}>
        Add More
      </button>
    </fieldset>
  );
}
