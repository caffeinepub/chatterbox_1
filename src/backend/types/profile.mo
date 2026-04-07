import Storage "mo:caffeineai-object-storage/Storage";
import Common "common";

module {
  public type Profile = {
    userId    : Common.UserId;
    username  : Text;
    avatar    : ?Storage.ExternalBlob;  // optional avatar image
    status    : Text;                   // status message
    presence  : Common.PresenceStatus;
    lastSeen  : Common.Timestamp;
  };

  // Shared (API boundary) — no mutable fields, no internal containers
  public type ProfilePublic = {
    userId   : Common.UserId;
    username : Text;
    avatar   : ?Storage.ExternalBlob;
    status   : Text;
    presence : Common.PresenceStatus;
    lastSeen : Common.Timestamp;
  };

  public type SaveProfileRequest = {
    username : Text;
    avatar   : ?Storage.ExternalBlob;
    status   : Text;
  };
};
