const LOREM_TEXT = `Test scroll container`;

const UserIndex = () => {
  return (
    <div>
      {Array.from({ length: 90 }).map((_, index) => (
        <p key={index}>{LOREM_TEXT}</p>
      ))}
    </div>
  );
};

export default UserIndex;
