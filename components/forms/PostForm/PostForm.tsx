import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BiUpload } from 'react-icons/bi';
import Image from 'next/image';
import { Post } from '@prisma/client';
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import isEmpty from 'lodash.isempty';

import FileInput from 'components/FileInput';
import MonacoEditor from 'components/MonacoEditor';
import PostPreview from 'components/PostPreview/PostPreview';
import { Select } from 'components/Select';
import WysiwygEditor from 'components/WysiwygEditor';

import { getToday } from 'helpers/datetime';
import { sendFile } from 'helpers/files';

import styles from './PostForm.module.scss';

const LANGS = ['sk', 'uk', 'ru'];

type Props = {
  data?: Post;
  onSubmit(data: Post): void;
};

export default function PostForm ({ data, onSubmit }: Props) {
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<Post>({ defaultValues: data });
  const [activeTab, setActiveTab] = useState<'text' |'html' | 'preview'>('text');

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (updateState: EditorState) => {
    setEditorState(updateState);
    setValue('content', draftToHtml(convertToRaw(updateState.getCurrentContent())));
  };

  const submitHandler: SubmitHandler<Post> = (data) => {
    onSubmit(data);
  };

  const [allowRender, setAllowRender] = useState(false);
  useEffect(() => {
    setAllowRender(true);
  }, []);

  useEffect(() => {
    if (data) {
      setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(data.content).contentBlocks)));
    }
  }, [data]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
      <button type="submit" disabled={!isEmpty(errors)} className={styles.submitBtn}>Save</button>
      <div className={styles.dataSections}>
        <div className={styles.data}>
          <b className={styles.title}>View data</b>
          <div className={styles.fields}>
            <div className={styles.col}>
              <label>
                <span>Name</span>
                <input type="text" {...register('name', { required: true })} />
              </label>
              <label>
                <span>Publication date</span>
                <input type="text" {...register('publicationDate', { required: true, value: getToday() })} />
              </label>
              <Controller
                control={control}
                name="lang"
                render={({ field }) => (
                  <label>
                    <span>Language</span>
                    <Select
                      options={LANGS.map((lg) => ({
                        value: lg,
                        text: lg.toUpperCase(),
                      }))}
                      onChange={({ value }) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                    />
                  </label>
                )}
              />
            </div>
            <div className={styles.col}>
              <Controller
                control={control}
                name="titleImgUrl"
                render={({ field }) => (
                  <div style={{ marginTop: 15 }}>
                    <FileInput id={'titleImgUrl'} onChange={(e) => void sendFile(e.target.files?.[0]).then((filename) => void field.onChange(filename))}>
                      <a
                        title="Upload"
                        className="button"
                      >
                        <BiUpload size={20} />
                    Title image
                      </a>
                    </FileInput>
                    <div className={styles.imgWrapper}>
                      {field.value && <Image layout="fill" src={`/api/files?id=${field.value}`} alt="image" />}
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
        <div className={styles.data}>
          <b className={styles.title}>SEO data</b>
          <div className={styles.fields}>
            <div className={styles.col}>
              <label>
                <span>Canonical URL</span>
                <input type="text" {...register('canonicalUrl', { required: true })} />
              </label>
              <label>
                <span>Slug URL</span>
                <input type="text" {...register('slugUrl', { required: true })} />
              </label>
              <label>
                <span>Meta name</span>
                <input type="text" {...register('metaName', { required: true })} />
              </label>
            </div>
            <div>
              <label>
                <span>Meta description</span>
                <input type="text" {...register('metaDescription', { required: true })} />
              </label>
              <label>
                <span>Meta keywords</span>
                <input type="text" {...register('metaKeywords', { required: true })} />
              </label>
              <label>
                <span>Meta Hreflang</span>
                <input type="text" {...register('metaHreflang', { required: true })} />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.contentTabs}>
        <b>Content</b>
        <div className={styles.tabs}>
          <div className={`${styles.tab} ${activeTab === 'text' && styles.active}`} onClick={() => setActiveTab('text')}>Text</div>
          <div className={`${styles.tab} ${activeTab === 'html' && styles.active}`} onClick={() => setActiveTab('html')}>Html</div>
          <div className={`${styles.tab} ${activeTab === 'preview' && styles.active}`} onClick={() => setActiveTab('preview')}>Preview</div>
        </div>
        {allowRender && (
          <div className={styles.content}>
            <div className={`${styles.panel} ${activeTab === 'text' && styles.active}`}>
              <WysiwygEditor
                toolbar={{
                  options: ['inline', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image'],
                }}
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                editorClassName={styles.editor}
              />
            </div>
            <div className={`${styles.panel} ${activeTab === 'html' && styles.active}`}>
              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <MonacoEditor
                    height="400px"
                    defaultLanguage="html"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(value).contentBlocks)));
                    }}
                    theme="vs-dark"
                  />
                )}
              />
            </div>
            <div className={`${styles.panel} ${activeTab === 'preview' && styles.active}`}>
              <PostPreview data={watch()} />
            </div>
          </div>
        )}
      </div>
    </form>
  );
}