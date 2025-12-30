import React from "react";
import { Link } from "react-router-dom";
import UniversalCardPreview from "../../shared/UniversalCardPreview";

export default function ProfileCard({ profile }) {
  return (
    <Link to={`/dashboard/profiles/${profile.id}`} className="block group">
      <div className="hover:scale-[1.02] transition-transform duration-300">
        <UniversalCardPreview
          profile={profile}
          selectedTemplate={profile.template}
          showViewCount={true}
        />
      </div>
    </Link>
  );
}
