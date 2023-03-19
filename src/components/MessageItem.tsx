import type { Accessor, Setter } from "solid-js"
import type { ChatMessage } from "../types"
import MarkdownIt from "markdown-it"
// @ts-ignore
import mdKatex from "markdown-it-katex"
import mdHighlight from "markdown-it-highlightjs"
import mdKbd from "markdown-it-kbd"
import MessageAction from "./MessageAction"
import { preWrapperPlugin } from "../markdown"
import "../styles/message.css"
import "../styles/clipboard.css"
import { useCopyCode } from "../hooks"
import { copyToClipboard } from "~/utils"
import robotImg from "/robot-1-32.png";
import profile from "/pro.png";

interface Props {
  role: ChatMessage["role"]
  message: string
  index?: number
  setInputContent?: Setter<string>
  setMessageList?: Setter<ChatMessage[]>
}

export default (props: Props) => {
  useCopyCode()
  const roleClass = {
    system: "bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300",
    // user: "bg-gradient-to-r from-red-300 to-blue-700 ",
    user: "bg-gradient-to-r from-red-300 to-blue-700 ",
    assistant: "bg-gradient-to-r from-yellow-300 to-red-700 "
  }

  const md = MarkdownIt({
    linkify: true,
    breaks: true
  })
    .use(mdKatex)
    .use(mdHighlight, {
      inline: true
    })
    .use(mdKbd)
    .use(preWrapperPlugin)

  function copy() {
    copyToClipboard(props.message)
  }

  function edit() {
    props.setInputContent && props.setInputContent(props.message)
  }

  function del() {
    if (props.setMessageList && props.index !== undefined) {
      props.setMessageList(list => {
        if (list[props.index!]?.role === "user") {
          const arr = list.reduce(
            (acc, cur, i) => {
              if (cur.role === "assistant" && i === acc.at(-1)! + 1) acc.push(i)
              return acc
            },
            [props.index] as number[]
          )

          return list.filter((_, i) => {
            return !arr.includes(i)
          })
        }
        return list.filter((_, i) => i !== props.index)
      })
    }
  }

  return (
    <div
      class="group flex py-2 gap-3 px-4 rounded-lg transition-colors md:hover:bg-slate/5 dark:md:hover:bg-slate/2 relative message-item"
      classList={{
        temporary: props.index === undefined
      }}
    >
      <div
    //     class={`shrink-0 w-7 h-7 mt-4 rounded-full op-80 ${
    //       roleClass[props.role]
    //     }`}
    //   ></div>
    class:op-75={role === "user"}>
      {
        // role !== "user" ? <div style="width: 32px; height: 32px; margin-top: 18px;"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" style="min-width: 32px; min-height: 32px;" class="astro-3EF6KSR2"><g fill="none" class="astro-3EF6KSR2"><path fill="#F8312F" d="M5 3.5a1.5 1.5 0 0 1-1 1.415V12l2.16 5.487L4 23c-1.1 0-2-.9-2-1.998v-7.004a2 2 0 0 1 1-1.728V4.915A1.5 1.5 0 1 1 5 3.5Zm25.05.05c0 .681-.44 1.26-1.05 1.468V12.2c.597.347 1 .994 1 1.73v7.01c0 1.1-.9 2-2 2l-2.94-5.68L28 11.93V5.018a1.55 1.55 0 1 1 2.05-1.468Z" class="astro-3EF6KSR2"></path><path fill="#FFB02E" d="M11 4.5A1.5 1.5 0 0 1 12.5 3h7a1.5 1.5 0 0 1 .43 2.938c-.277.082-.57.104-.847.186l-3.053.904l-3.12-.908c-.272-.08-.56-.1-.832-.18A1.5 1.5 0 0 1 11 4.5Z" class="astro-3EF6KSR2"></path><path fill="#CDC4D6" d="M22.05 30H9.95C6.66 30 4 27.34 4 24.05V12.03C4 8.7 6.7 6 10.03 6h11.95C25.3 6 28 8.7 28 12.03v12.03c0 3.28-2.66 5.94-5.95 5.94Z" class="astro-3EF6KSR2"></path><path fill="#212121" d="M9.247 18.5h13.506c2.33 0 4.247-1.919 4.247-4.25A4.257 4.257 0 0 0 22.753 10H9.247A4.257 4.257 0 0 0 5 14.25a4.257 4.257 0 0 0 4.247 4.25Zm4.225 7.5h5.056C19.34 26 20 25.326 20 24.5s-.66-1.5-1.472-1.5h-5.056C12.66 23 12 23.674 12 24.5s.66 1.5 1.472 1.5Z" class="astro-3EF6KSR2"></path><path fill="#00A6ED" d="M10.25 12C9.56 12 9 12.56 9 13.25v2.5a1.25 1.25 0 1 0 2.5 0v-2.5c0-.69-.56-1.25-1.25-1.25Zm11.5 0c-.69 0-1.25.56-1.25 1.25v2.5a1.25 1.25 0 1 0 2.5 0v-2.5c0-.69-.56-1.25-1.25-1.25Z" class="astro-3EF6KSR2"></path></g></svg></div>: 
        role !== "user" ? <img style="width: 32px; height: 32px; border-radius: 50%;background-size: cover;margin-top: 20px;" src={robotImg} />: 
       <img style="width: 32px; height: 32px; border-radius: 50%;background-size: cover;margin-top: 20px;" src={profile} />
      }
      <div
        class="message prose prose-slate dark:prose-invert dark:text-slate break-words overflow-hidden"
        innerHTML={md.render(props.message)}
      />
      <MessageAction
        del={del}
        copy={copy}
        edit={edit}
        role={props.role}
        hidden={props.index === undefined}
      />
    </div>
  )
}
