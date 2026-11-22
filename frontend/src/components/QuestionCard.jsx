export default function QuestionCard(props){
  const canEdit = props.currentUser.role === 'admin' 
  const is_discussed = props.question.is_discussed
  // console.log(props.currentUser.role)
  return <>
    <div className="flex flex-col w-full px-10 py-5 gap-10 rounded-lg bg-white">
      <p className="question text-lg ">{props.question.question_text}</p>
      <div className="flex justify-between ">
        <div className="flex gap-1">
          <p className="bg-blue-600 text-white font-bold py-1 px-5 rounded-lg">{props.question.category_name}</p>
          <p>{props.question.category_author}</p>
          <p className={`px-3 py-1 rounded-lg ${
            is_discussed 
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-400 text-gray-800'
          }`}>{is_discussed ? 'Обсуждено' : 'Не обсуждено'}</p>
        </div>
        {canEdit && (
          <div className="flex items-center gap-1">
            <button className={`px-3 py-1 rounded-lg ${is_discussed ? 'bg-gray-500 text-gray-800' : 'bg-blue-600 text-white'}`} onClick={() => props.onToggle(props.question.id, is_discussed)}>{is_discussed ? 'Отмечено':'Отметить'}</button>
            <button className="bg-red-500 px-3 py-1 rounded-lg text-red-900" onClick={() => props.onDelete(props.question.id)}>Уалить</button>
          </div>
        )}
      </div>
    </div>
  </>
}