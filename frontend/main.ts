import { createApp } from "vue";

import { router } from "./routes";
import { calculateCPIMThreadID, RunSIPConnection } from "./lib/SIP";
import WebTextingContainer from "./components/WebTextingContainer/WebTextingContainer.vue";
import { backfillMessages } from "./lib/backfill";
import { backfillFromTimestamp } from "./lib/backfillFromTimestamp";
import { emitter, MessageData, addMessage } from "./lib/global";
import { sendMessage } from "./lib/sendMessage";
import {
  updateLastSeen,
  updateUserLastSeenOptions,
} from "./lib/updateLastSeen";
// these are passed to initializeThreadJS from php when initializeThreadJS() is called in thread.php
type ThreadOptions = {
  username: string;
  password: string;
  server: string;
  threadName?: string;
  contactEditLink?: string;
  groupMembers?: string[];
  extensionUUID: string;
  ownNumber: string;
  remoteNumber?: string;
  groupUUID?: string;
};
type ThreadPreviewOptions = {
  remoteNumber?: String;
  groupUUID?: String;
  last_message: Array<String>;
  timestamp: String;
  displayName: String;
  link: String;
  bodyPreview: String;
  ownNumber: String;
  contactEditLink: String;
  groupMembers: String[];
};
type ThreadListOptions = {
  username: string;
  password: string;
  server: string;
  extensionUUID: string;
  ownNumber: string;
  threads?: Object[];
};

type WebTextingContainerOptions = {
  username: string;
  password: string;
  server: string;
  extensionUUID: string;
  ownNumber: string;
  threads?: ThreadListOptions[];
  $thread_preview_opts: ThreadPreviewOptions[];
  displayName?: string;
  contactEditLink?: string;
  groupMembers?: string[];
  remoteNumber?: string;
  groupUUID?: string;
  refreshLink?: string;
  multiple_wt_extensions?: boolean;
};

/* This is going to be where we build and mount the app once it's been configured to run from ThreadLists worklow
 */
export const initializeWebTextingContainer =
  function initializeWebTextingContainerJS(opts: WebTextingContainerOptions) {
    let threadPreviewMap = new Map<string, ThreadPreviewOptions>(); //buildPreviews(opts);

    //how do we want to pass props into threadlist.
    //in theory threads has to be parsed and sent to each conversation component but is that state or props
    const containerProps = {
      extensionUUID: opts.extensionUUID,
      remoteNumber: opts.remoteNumber,
      groupUUID: opts.groupUUID,
      displayName: opts.username,
      ownNumber: opts.ownNumber,
      contactEditLink: opts.contactEditLink,
      groupMembers: opts.groupMembers,
      threads: opts.threads,
      threadPreviews: threadPreviewMap,
      multipleWebTextingExtensions: opts.multiple_wt_extensions,
    };
    const app = createApp(WebTextingContainer, containerProps);
    app.config.errorHandler = (err, instance, info) => {
      console.log("error from within vue:", info, err, instance);
      console.error(err);
    };
    if (opts.ownNumber[0] === "+") {
      opts.ownNumber = opts.ownNumber.substring(1);
    }
    app.use(router);
    app.mount("#TEST_DIV_FOR_TESTING_WEBTEXTING");
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        console.log(opts.extensionUUID);
        console.log("document unhidden");
        emitter.emit("document-unhidden");
        //emitter.emit("backfill-previews-requested");
      }
    });

    // RunSIPConnection(
    //   opts.username,
    //   opts.password,
    //   opts.server,
    //   opts.ownNumber,
    //   opts.extensionUUID,
    //   opts.remoteNumber,
    //   opts.groupUUID
    // );
    // any event that needs absolute global scope should be listened for here
    emitter.on("backfill-requested", (key: string) => {
      console.log(`main.ts backfill key ${key}`);
      //key is either a uuid or phone number. uuid length is  16
      if (key) {
        if (key.length < 15) {
          console.log(`backfill using remotenumber: ${key}`);
          backfillMessages(opts.extensionUUID, key, undefined);
        } else {
          console.log(`backfill using group ${key}`);
          backfillMessages(opts.extensionUUID, undefined, key);
        }
      } else {
        console.log("ignoring backfill request with no key");
      }
    });
    emitter.on(
      "conversation-accessed",
      (updateUserLastSeenObject: updateUserLastSeenOptions) => {
        //console.log("this is where we call updateLastSeen",updateUserLastSeenObject);
        updateLastSeen(updateUserLastSeenObject);
      }
    );

    emitter.on("outbound-message", async (message: MessageData) => {
      //message.timestamp = moment();
      const m = message;
      // if plain/text use to number as key
      // if it's cpim
      if (message.cpim) {
        message.body = message.cpim.serialize();
        message.contentType = 'message/cpim';
      }
      //send message via outbound-hook.php
      let sendMessageQuery: MessageData = message;
      sendMessageQuery.from_host = opts.server;
      sendMessageQuery.extensionUUID = opts.extensionUUID;
      let sendMessageResponse = await sendMessage(sendMessageQuery);
      //console.log(sendMessageResponse);
      if (sendMessageResponse && sendMessageResponse.statusCode && sendMessageResponse.statusCode == 200) {
        sendMessageQuery.id = sendMessageResponse.id;
        sendMessageQuery.key = sendMessageResponse.key;
        sendMessageQuery.delivered = true;
        sendMessageResponse.delivered = true;
        //add message to state
        if (message.cpim && (message.cpim.headers['Group-UUID'] || message.cpim.headers['group-uuid'])) {
          const cpimThreadID = calculateCPIMThreadID(message.cpim, message.direction, message.to, message.from);
          addMessage(cpimThreadID, sendMessageQuery);
        }
        else {
          addMessage(message.to, sendMessageQuery);
        }
        emitter.emit('message-success', sendMessageQuery);
      }
      else {
        //console.log('message failed to send');
        if (message.cpim && (message.cpim.headers['Group-UUID'] || message.cpim.headers['group-uuid'])) {
          const cpimThreadID = calculateCPIMThreadID(message.cpim, message.direction, message.to, message.from);
          addMessage(cpimThreadID, sendMessageQuery);
        }
        else {
          addMessage(message.to, sendMessageQuery);
        }
        emitter.emit('message-failed', sendMessageQuery);
      }

    });

  }
