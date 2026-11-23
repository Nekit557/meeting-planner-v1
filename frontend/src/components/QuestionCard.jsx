import { use, useState } from "react"

export default function QuestionCard(props) {
  const canEdit = props.currentUser.role === 'admin' || props.question.user_id === props.currentUser.id
  const isadmin = props.currentUser.role === 'admin'
  const is_discussed = props.question.is_discussed
  const isAuthor = props.question.user_id === props.currentUser.id
  const canEditText = canEdit && !is_discussed
  const [isEditing, setIsEditing] = useState(false)
  const [newText, setNewText] = useState(props.question.question_text)

  // console.log(props.currentUser.role)
  return <>
    <div className=" question_card flex flex-col w-full px-10 py-5 rounded-xl bg-white">
      <div className="flex justify-between items-center">
        {isAuthor && (
          <p className="text-sm rounded-lg px-1 flex items-center  bg-amber-100 h-7 max-w-25 text-center">Ваш вопрос</p>
        )}
        {canEditText && (
          <button className="border-1 px-2 rounded-xl text-3xl edit_btn" onClick={() => setIsEditing(true)}>✎</button>
        )}
      </div>
      {!isEditing && (
        <p className="question text-lg ">{props.question.question_text}</p>
      )}
      {isEditing && (
        <div className="flex w-full gap-3 items-center">
          <input type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="rounded-lg w-full my-3 h-10 px-2 border-1 border-gray-300" />
          <button className="px-3 py-1 my-3  rounded-lg bg-blue-600 text-white" onClick={() => { setIsEditing(false); props.onClick(props.question.id, newText) }}>Сохранить</button>
        </div>
      )
      }
      <p className="font-bold  py-1 rounded-xl q_category"> Категория: {props.question.category_name}</p>

      <div className="flex justify-between items-center">

        <div className="flex gap-1 items-center">
          <p className={`px-3 py-1 rounded-xl q_discussed ${is_discussed
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-400 text-gray-800'
            }`}>{is_discussed ? '✓' : '✓'}</p>
          <p className="text-lg question_author"><i>Автор:</i> {props.question.author_name}</p>

        </div>


        {canEdit && (
          <div className="flex items-center gap-1">
            <button className={`px-3 py-1 rounded-lg ${is_discussed ? 'bg-gray-500 text-gray-800' : 'bg-green-100 text-green-700'}`} onClick={() => props.onToggle(props.question.id, is_discussed)}>{is_discussed ? 'Отмечено' : 'Отметить'}</button>
            <button className="bg-red-500 px-3 py-1 rounded-lg text-red-900" onClick={() => props.onDelete(props.question.id)}>✖</button>
          </div>
        )}
      </div>
    </div>
  </>
}