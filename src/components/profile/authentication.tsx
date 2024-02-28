import { UserProps } from "@/types/profile"
import { Avatar } from ".."

const Authentication = (props: UserProps) => {
	const displayName = props.firstName
		? `${props.firstName} ${props.lastName}`
		: props.email.split("@")[0]

	return (
		<div className="h-[644px] w-full rounded-lg border border-black-500 bg-black-700 p-10">
			<div className="flex w-full items-center justify-between">
				<div className="flex items-center gap-5">
					<div className="aspect-square w-[120px] rounded-full bg-alt-orange-100">
						<Avatar
							imageUrl={props.imageUrl}
							name={displayName}
							email={props.email}
						/>
					</div>
					<div>
						<p className="font-satoshi text-2xl font-bold capitalize">
							{displayName}
						</p>
						<p className="text-white-300">{props.email}</p>
					</div>
				</div>
			</div>
			<hr className="my-6 w-full" />
			<div className="grid w-full grid-cols-3 gap-5">
				<div className="w-full">
					<p className="font-bold">2 Factor Authentication</p>
					<p className="text-sm text-white-300">
						Add extra security measures to protect your account
					</p>
				</div>
				<div className="col-span-2 w-2/3"></div>
			</div>
		</div>
	)
}

export default Authentication
