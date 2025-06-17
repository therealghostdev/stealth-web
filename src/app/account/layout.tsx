import Image from "next/image"

import { logo, wallet } from "@/assets/images"

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<main className="bg-black-100">
			<section className="m-auto flex h-screen w-screen max-w-[1440px] items-center justify-center overflow-hidden text-white-100">
				<div className="background-imag relative hidden h-full w-full p-12 md:block md:w-[45%]">
					<div className="absolute bottom-0 flex w-full flex-col justify-start text-left">
						<div className="mb-8 flex items-center">
							<Image src={logo} alt="stealth money logo" />
						</div>
						<p className="font-satoshi text-[32px] font-bold md:w-[300px] lg:w-[390px]">
							Fully control and build your Bitcoin wealth with
							<br />
							<span className="circled relative z-50 inline-block">
								<span className="">Stealth Money.</span>
							</span>
						</p>
					</div>
				</div>
				<div className="h-full w-full flex-1 overflow-y-auto bg-black-100 px-4 py-20 lg:w-[55%] lg:pl-[72px] lg:pr-[162px]">
					{children}
				</div>
			</section>
		</main>
	)
}
