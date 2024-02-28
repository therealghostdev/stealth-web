export type UserProps = {
	profileId: number
	createdAt: string | null
	updatedAt: string | null
	status:
		| "ACTIVE"
		| "INACTIVE"
		| "PENDING"
		| "REJECTED"
		| "SUSPENDED"
		| "DELETED"
	kycConfigId: number
	kycInfoId: number
	userId: number
	profileType: string
	login: string
	firstName: string
	lastName: string
	email: string
	imageUrl: string | null
	activated: boolean
	langKey: string
	createdBy: string
	createdDate: string
	lastModifiedBy: string
	lastModifiedDate: string
	authorities: string[]
	admin: false
	accountDetail?: {
		accountNumber: string
		accountName: string
		bankName: string
		status: string
	}
}
