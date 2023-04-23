import React, { ForwardedRef, forwardRef, HTMLProps, PropsWithChildren } from 'react';

// import styles from 'styles/components/forms/FileInput.module.scss';

type Props = HTMLProps<HTMLInputElement> & {
  id: string;
  className?: string;
  onChange?(e: { target: { files?: File[] | null } })
}

const FileInput = forwardRef(({ id, children, disabled, className, ...rest }: PropsWithChildren<Props>, ref: ForwardedRef<HTMLInputElement>) => {
  return (
    <>
      <label htmlFor={id} className={className}>
        {children}
      </label>
      <input
        {...rest}
        id={id}
        ref={ref}
        type="file"
        disabled={disabled}
        hidden
      />
    </>
  );
});

FileInput.displayName = 'FileInput';

export default FileInput;
