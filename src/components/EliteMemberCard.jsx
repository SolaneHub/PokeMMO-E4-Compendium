import React from "react";
import "../App.css";

const EliteMemberCard = ({ member, onMemberClick, isSelected, background, shadowColor }) => {
  return (
    <div
      className={`card ${isSelected ? "selected" : ""}`}
      onClick={() => onMemberClick(member)}
      style={isSelected ? { boxShadow: `0 4px 10px ${shadowColor}aa` } : {}}
    >
      <p className="elite4-name" style={{ background: background }}>{member.name}</p>

      <img
        src={member.image}
        alt={member.name}
        className="image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://placehold.co/180x120/cccccc/333333?text=${member.name.replace(
            " ",
            "+"
          )}`;
        }}
      />
    </div>
  );
};

export default EliteMemberCard;
