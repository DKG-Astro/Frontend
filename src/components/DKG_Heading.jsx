import React from "react";

const Heading = ({title, txnType, date, txnNo}) => {
  return (
    <div className="flex w-full justify-between">
      <h4>
        {/* {txnType} No. : <br />
        {txnNo} */}
      </h4>
      <h2 className="text-center font-bold text-lg">
        {title}
      </h2>
      <h4>
        {/* {txnType} Date. : <br /> {date} */}
      </h4>
    </div>
  );
};

export default Heading;
