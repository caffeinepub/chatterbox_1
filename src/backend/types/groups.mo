import Storage "mo:caffeineai-object-storage/Storage";
import Common "common";

module {
  public type Group = {
    id          : Common.GroupId;
    name        : Text;
    description : Text;
    icon        : ?Storage.ExternalBlob;
    ownerId     : Common.UserId;
    createdAt   : Common.Timestamp;
  };

  public type GroupMember = {
    groupId  : Common.GroupId;
    userId   : Common.UserId;
    joinedAt : Common.Timestamp;
    role     : GroupMemberRole;
  };

  public type GroupMemberRole = {
    #owner;
    #member;
  };

  // Group summary for inbox polling
  public type GroupSummary = {
    group       : Group;
    memberCount : Nat;
    lastMessage : ?Common.MessageId;
    unreadCount : Nat;
  };

  public type CreateGroupRequest = {
    name        : Text;
    description : Text;
    icon        : ?Storage.ExternalBlob;
  };

  public type EditGroupRequest = {
    name        : Text;
    description : Text;
    icon        : ?Storage.ExternalBlob;
  };
};
