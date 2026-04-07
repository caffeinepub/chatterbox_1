import { useReactions } from "../hooks/useReactions";
import {
  useDirectMessageReaders,
  useGroupMessageReaders,
} from "../hooks/useReadReceipts";
import type { Message, UserId } from "../types";
import { MessageBubble } from "./MessageBubble";

// ── Direct message with reactions + read receipts ────────────────────────────

interface DirectMessageProps {
  message: Message;
  isSelf: boolean;
  selfId: string;
  senderName?: string;
  showSender?: boolean;
  conversationId: string;
  otherUserId?: UserId;
}

export function DirectMessageWithExtras({
  message,
  isSelf,
  selfId,
  senderName,
  showSender,
  conversationId,
  otherUserId,
}: DirectMessageProps) {
  const { reactions, addReaction, removeReaction } = useReactions(
    conversationId,
    message.id,
  );

  const convIdBigInt = BigInt(conversationId);
  const { data: readers = [] } = useDirectMessageReaders(
    convIdBigInt,
    message.id,
    isSelf,
  );

  const isRead = isSelf
    ? otherUserId
      ? readers.some((r) => r.toText() === otherUserId.toText())
      : false
    : undefined;

  const handleReact = (emoji: string, alreadyReacted: boolean) => {
    if (alreadyReacted) {
      removeReaction.mutate(emoji);
    } else {
      addReaction.mutate(emoji);
    }
  };

  return (
    <MessageBubble
      message={message}
      isSelf={isSelf}
      senderName={senderName}
      showSender={showSender}
      selfId={selfId}
      conversationId={conversationId}
      reactions={reactions}
      onReact={handleReact}
      isRead={isRead}
    />
  );
}

// ── Group message with reactions + read receipts ─────────────────────────────

interface GroupMessageProps {
  message: Message;
  isSelf: boolean;
  selfId: string;
  senderName?: string;
  showSender?: boolean;
  groupId: string;
}

export function GroupMessageWithExtras({
  message,
  isSelf,
  selfId,
  senderName,
  showSender,
  groupId,
}: GroupMessageProps) {
  const conversationId = `group:${groupId}`;
  const { reactions, addReaction, removeReaction } = useReactions(
    conversationId,
    message.id,
  );

  const { data: readers = [] } = useGroupMessageReaders(
    BigInt(groupId),
    message.id,
    isSelf,
  );

  const handleReact = (emoji: string, alreadyReacted: boolean) => {
    if (alreadyReacted) {
      removeReaction.mutate(emoji);
    } else {
      addReaction.mutate(emoji);
    }
  };

  const readByCount = isSelf
    ? readers.filter((r) => r.toText() !== selfId).length
    : undefined;

  return (
    <MessageBubble
      message={message}
      isSelf={isSelf}
      senderName={senderName}
      showSender={showSender}
      selfId={selfId}
      conversationId={conversationId}
      reactions={reactions}
      onReact={handleReact}
      readByCount={readByCount}
    />
  );
}
