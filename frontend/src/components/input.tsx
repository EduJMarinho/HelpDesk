type Props = React.ComponentProps<"input"> & {
    legend?: string
}

export function Input({ legend, type= "text",...rest }: Props) {
    return (
        <fieldset className="flex flex-1 max-h-20 focus-within:text-violet-700">
            {legend && (
                <legend className="uppercase text-xxs mb-2 text-inherit">
                    {legend}
                </legend>
            )}

            <input 
            type={type} 
            className="w-full h-12 rounded-lg border border-gray-300 px-4 text-sm
             text-gray-500 bg-transparent outline-none focus:border-2 focus:border-amber-800
              placeholder:text-gray-300" 
            {...rest} />
        </fieldset>
    )
}