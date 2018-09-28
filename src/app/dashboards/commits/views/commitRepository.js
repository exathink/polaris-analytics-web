import React from 'react';
import {Contexts} from "../../../meta";
import {Flex} from 'reflexbox';
import {RowNoOverflow} from "../../shared/containers/flex/rowNoOverflow";
import {Link} from 'react-router-dom';
import Repositories from '../../repositories/context';
import {url_for_instance} from "../../../framework/navigation/context/helpers";

export const CommitRepository = ({commit}) => (
    <RowNoOverflow align={'center'}>
      <Link to={url_for_instance(Repositories, commit.repository, commit.repositoryKey)} title={"Repository"}>
        <i className={`ion ${Contexts.repositories.icon}`} style={{margin: '5px'}}/>
        <span>{commit.repository}</span>
      </Link>
    </RowNoOverflow>
);